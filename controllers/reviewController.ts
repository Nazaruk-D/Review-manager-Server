import {supabase} from "../supabase";

class reviewController {
    async getReviews(req: any, res: any) {
        const userId = req.params.userId;
        const { data: reviews, error: reviewError } = await supabase
            .from('reviews')
            .select('*')
            .eq('author_id', userId);

        if (reviewError) {
            console.error(reviewError);
            res.status(500).json({message: 'Internal server error', code: 500});
            return;
        }

        const reviewIds = reviews.map(review => review.id);

        const { data: tags, error: tagsError } = await supabase
            .from('tags')
            .select('*, review_tags(review_id).tag_id(name)')
            .in('review_tags.review_id', reviewIds);

        if (tagsError) {
            console.error(tagsError);
            res.status(500).json({message: 'Internal server error', code: 500});
            return;
        }

        const { data: images, error: imagesError } = await supabase
            .from('images')
            .select('*')
            .in('review_id', reviewIds);

        if (imagesError) {
            console.error(imagesError);
            res.status(500).json({message: 'Internal server error', code: 500});
            return;
        }

        const { data: likes, error: likesError } = await supabase
            .from('likes')
            .select('*')
            .in('review_id', reviewIds);

        if (likesError) {
            console.error(likesError);
            res.status(500).json({message: 'Internal server error', code: 500});
            return;
        }

        const reviewsWithData = reviews.map((review) => {
            const reviewTags = tags.filter((tag:any) => tag.review_tags!.find((rt:any) => rt.review_id === review.id));
            const reviewImages = images.filter(image => image.review_id === review.id);
            const reviewLikes = likes.filter(like => like.review_id === review.id);

            return {
                ...review,
                tags: reviewTags.map((tag: any) => tag.name),
                images: reviewImages,
                likes: reviewLikes
            };
        });

        res.status(200).json({message: 'Reviews', data: reviewsWithData, code: 200});
    }

    async createReview(req: any, res: any) {
        try {
            const {title, review_title, body, category, rating, author_id, tags, photo, author_name} = req.body;

            const {data, error} = await supabase
                .from('reviews')
                .insert({title, review_title, body, category, rating, author_id, author_name})
                .select('id')
                .single();

            if (error) {
                throw error;
            }

            const newReviewId = data.id;

            if (tags && tags.length > 0) {
                const tagIds = await Promise.all(tags.map(async (tag: string) => {
                    const {data, error} = await supabase
                        .from('tags')
                        .select('id')
                        .eq('name', tag)
                        .single();

                    if (!data) {
                        const {data, error: tagError} = await supabase
                            .from('tags')
                            .insert({name: tag})
                            .select('id')
                            .single<{id: string}>();
                        if (tagError) throw tagError;

                        return data?.id;
                    }

                    return data.id;
                }));

                const reviewTagInserts = tagIds.map((tagId) => {
                    return {review_id: newReviewId, tag_id: tagId};
                });

                const {error: reviewTagError} = await supabase
                    .from('review_tags')
                    .insert(reviewTagInserts)

                if (reviewTagError) throw reviewTagError;
            }

            if (photo && photo.length > 0) {
                const {data: imageData, error: imageError} = await supabase
                    .from('images')
                    .insert({url: photo, review_id: newReviewId})
                    .single();

                if (imageError) throw imageError;
            }

            res.status(201).json({message: 'Review added', data: req.body, code: 201});
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Logout error', code: 400})
        }
    }
}

module.exports = new reviewController()


interface Tag {
    id: number;
    name: string;
    review_tags?: ReviewTag[];
}


interface GetReviewsResponse {
    message: string;
    data: ResponseDataType;
    code: number;
}

interface ResponseDataType {
    reviews: Review[];
    tags: Tag[];
    images: Image[];
    ratings: Rating[];
    comments: Comment[];
    likes: Like[];
    review_tags: ReviewTag[];
};

interface ReviewTag {
    id: number;
    review_id: string;
    tag_id: number;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    user_name: string;
    email: string;
    avatar?: string;
    role: string;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
}

interface Review {
    id: string;
    title: string;
    review_title: string;
    author_name: string;
    body: string;
    category: string;
    rating: number;
    author_id: string;
    created_at: string;
    updated_at: string;
    tags?: Tag[];
    images?: Image[];
    ratings?: Rating[];
    comments?: Comment[];
    likes?: Like[];
}

interface Tag {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface ReviewTag {
    id: number;
    review_id: string;
    tag_id: number;
    created_at: string;
    updated_at: string;
}

interface Image {
    id: number;
    url: string;
    review_id: string;
    created_at: string;
    updated_at: string;
}

interface Rating {
    id: number;
    value: number;
    review_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface Comment {
    id: number;
    body: string;
    review_id: string;
    author_id: string;
    created_at: string;
    updated_at: string;
}

interface Like {
    id: number;
    review_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}