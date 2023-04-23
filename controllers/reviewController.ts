import {supabase} from "../supabase";
import {storage} from "../utils/firebase";
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";

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
            const reviewLikes = likes.filter(like => like.review_id === review.id);

            return {
                ...review,
                tags: reviewTags.map((tag: any) => tag.name),
                likes: reviewLikes
            };
        });

        res.status(200).json({message: 'Reviews', data: reviewsWithData, code: 200});
    }

    async getReviewById(req: any, res: any) {
        const reviewId = req.params.reviewId;

        // Получаем информацию о рецензии по ее id
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .select('*')
            .eq('id', reviewId)
            .single();

        if (reviewError) {
            console.error(reviewError);
            res.status(500).json({ message: 'Internal server error', code: 500 });
            return;
        }

        // Получаем теги, связанные с отзывом
        const { data: tags, error: tagsError } = await supabase
            .from('review_tags')
            .select('tag_id')
            .eq('review_id', reviewId);

        if (tagsError) {
            console.error(tagsError);
            res.status(500).json({ message: 'Internal server error', code: 500 });
            return;
        }

        // Получаем информацию о каждом теге и добавляем ее к отзыву
        const tagIds = tags.map((tag) => tag.tag_id);
        const { data: tagData, error: tagDataError } = await supabase
            .from('tags')
            .select('name')
            .in('id', tagIds);

        if (tagDataError) {
            console.error(tagDataError);
            res.status(500).json({ message: 'Internal server error', code: 500 });
            return;
        }

        const tagNames = tagData.map((tag) => tag.name);
        review.tags = tagNames;

        res.status(200).json({ message: 'Review', data: {...review}, code: 200 });
    }

    async createReview(req: any, res: any) {
        try {
            upload.single('reviewImage')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const file = req.file;
                const {title, review_title, body, category, rating, author_id, tags, author_name} = req.body;
                let downloadURL;
                let newReviewId: any;

                if (file) {
                    const storageRef = ref(storage, `review-manager/${author_id}/${file.originalname}`)
                    const metadata = {contentType: file.mimeType}
                    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
                    downloadURL = await getDownloadURL(snapshot.ref)

                    const {data, error} = await supabase
                        .from('reviews')
                        .insert({title, review_title, body, category, rating, author_id, author_name, image: downloadURL})
                        .select('id')
                        .single();
                    if (error) {
                        console.log(error);
                    }
                    newReviewId = data!.id;

                } else {
                    const {data, error} = await supabase
                        .from('reviews')
                        .insert({title, review_title, body, category, rating, author_id, author_name})
                        .select('id')
                        .single();

                    if (error) {
                        console.log(error);
                        return
                    }
                    newReviewId = data.id;
                }

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
                res.status(201).json({message: 'Review added', data: req.body, code: 201});
            })
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