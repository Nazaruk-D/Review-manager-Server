import {supabase} from "../supabase";
import {storage} from "../utils/firebase";

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";

class reviewController {
    async getUserReviews(req: any, res: any) {
        try {
            const userId = req.params.userId;
            const {data: reviews, error: reviewError} = await supabase
                .from('reviews')
                .select('*')
                .eq('author_id', userId);

            if (reviewError) {
                console.error(reviewError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const reviewIds = reviews.map(review => review.id);
            const {data: tags, error: tagsError} = await supabase
                .from('tags')
                .select('*, review_tags(review_id).tag_id(name)')
                .in('review_tags.review_id', reviewIds);

            if (tagsError) {
                console.error(tagsError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const {data: likes, error: likesError} = await supabase
                .from('likes')
                .select('*')
                .in('review_id', reviewIds);

            if (likesError) {
                console.error(likesError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const {data: ratings, error: ratingsError} = await supabase
                .from('ratings')
                .select('*, users:user_id(*)')
                .in('review_id', reviewIds);

            if (ratingsError) {
                console.error(ratingsError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const reviewsWithData = reviews.map((review) => {
                const reviewRatings = ratings.filter((rating: any) => rating.review_id === review.id);
                const ratingScores = reviewRatings.map((rating: any) => rating.value);
                const ratingUsers = reviewRatings.map((rating: any) => rating.users.id);
                const avgRating = ratingScores.reduce((acc: any, curr: any) => acc + curr, 0) / ratingScores.length;

                const reviewTags = tags.filter((tag: any) => tag.review_tags!.find((rt: any) => rt.review_id === review.id));
                const reviewLikes = likes.filter(like => like.review_id === review.id);

                return {
                    ...review,
                    tags: reviewTags.map((tag: any) => tag.name),
                    likes: reviewLikes,
                    rating: {
                        avgRating,
                        ratingUsers
                    }
                };
            });
            res.status(200).json({message: 'Reviews', data: reviewsWithData, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getReviewById(req: any, res: any) {
        try {
            const reviewId = req.params.reviewId;
            const {data: review, error: reviewError} = await supabase
                .from('reviews')
                .select('*')
                .eq('id', reviewId)
                .single();

            if (reviewError) {
                console.error(reviewError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const {data: tags, error: tagsError} = await supabase
                .from('review_tags')
                .select('tag_id')
                .eq('review_id', reviewId);
            if (tagsError) {
                console.error(tagsError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const tagIds = tags.map((tag) => tag.tag_id);
            const {data: tagData, error: tagDataError} = await supabase
                .from('tags')
                .select('name')
                .in('id', tagIds);

            if (tagDataError) {
                console.error(tagDataError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const tagNames = tagData.map((tag) => tag.name);
            review.tags = tagNames;

            const {data: ratings, error: ratingsError} = await supabase
                .from('ratings')
                .select('*, users:user_id(*)')
                .eq('review_id', reviewId);

            if (ratingsError) {
                console.error(ratingsError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const ratingScores = ratings.map((rating) => rating.value);
            const ratingUsers = ratings.map((rating) => rating.user_id);
            const avgRating = ratingScores.reduce((acc, curr) => acc + curr, 0) / ratingScores.length;
            review.rating = {
                avgRating: avgRating,
                ratingUsers: ratingUsers
            };

            const {data: likes, error: likesError} = await supabase
                .from('likes')
                .select('user_id')
                .eq('review_id', review.id);

            if (likesError) {
                console.error(likesError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const usersLiked = likes.map( like => like.user_id)
            console.log("usersLiked: ", usersLiked)
            review.likes = usersLiked

            res.status(200).json({message: 'Review', data: {...review}, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async deleteReviewById(req: any, res: any) {
        try {
            const reviewId = req.params.reviewId;

            // Удаление review_tags связанных с данным отзывом
            const {data: reviewTagsToDelete, error: reviewTagsError} = await supabase
                .from('review_tags')
                .select('*')
                .eq('review_id', reviewId);
            if (reviewTagsError) return res.status(500).json({
                message: 'Error deleting review tags',
                error: reviewTagsError
            });
            if (reviewTagsToDelete && reviewTagsToDelete.length > 0) {
                const {error: deleteReviewTagsError} = await supabase
                    .from('review_tags')
                    .delete()
                    .eq('review_id', reviewId);
                if (deleteReviewTagsError) return res.status(500).json({
                    message: 'Error deleting review tags',
                    error: deleteReviewTagsError
                });
            }

            // Удаление ratings связанных с данным отзывом
            const {data: ratingsToDelete, error: ratingsError} = await supabase
                .from('ratings')
                .select('*')
                .eq('review_id', reviewId);
            if (ratingsError) return res.status(500).json({message: 'Error deleting ratings', error: ratingsError});
            if (ratingsToDelete && ratingsToDelete.length > 0) {
                const {error: deleteRatingsError} = await supabase
                    .from('ratings')
                    .delete()
                    .eq('review_id', reviewId);
                if (deleteRatingsError) return res.status(500).json({
                    message: 'Error deleting ratings',
                    error: deleteRatingsError
                });
            }

            // Удаление comments связанных с данным отзывом
            const {data: commentsToDelete, error: commentsError} = await supabase
                .from('comments')
                .select('*')
                .eq('review_id', reviewId);
            if (commentsError) return res.status(500).json({message: 'Error deleting comments', error: commentsError});
            if (commentsToDelete && commentsToDelete.length > 0) {
                const {error: deleteCommentsError} = await supabase
                    .from('comments')
                    .delete()
                    .eq('review_id', reviewId);
                if (deleteCommentsError) return res.status(500).json({
                    message: 'Error deleting comments',
                    error: deleteCommentsError
                });
            }

            // Удаление likes связанных с данным отзывом
            const {data: likesToDelete, error: likesError} = await supabase
                .from('likes')
                .select('*')
                .eq('review_id', reviewId);
            if (likesError) return res.status(500).json({message: 'Error deleting likes', error: likesError});
            if (likesToDelete && likesToDelete.length > 0) {
                const {error: deleteLikesError} = await supabase
                    .from('likes')
                    .delete()
                    .eq('review_id', reviewId);
                if (deleteLikesError) return res.status(500).json({
                    message: 'Error deleting likes',
                    error: deleteLikesError
                });

                const {error: deleteReviewError} = await supabase
                    .from('reviews')
                    .delete()
                    .match({id: reviewId});
                if (deleteReviewError) {
                    throw deleteReviewError;
                }
            }
            res.status(200).json({message: 'Viewer deletion was successful', code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getLatestReviews(req: any, res: any) {
        try {
            const {data: reviews, error: reviewsError} = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', {ascending: false})
                .limit(3);

            if (reviewsError) {
                console.error(reviewsError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            for (let i = 0; i < reviews.length; i++) {
                const review = reviews[i];
                const {data: tags, error: tagsError} = await supabase
                    .from('review_tags')
                    .select('tag_id')
                    .eq('review_id', review.id);
                if (tagsError) {
                    console.error(tagsError);
                    res.status(500).json({message: 'Internal server error', code: 500});
                    return;
                }
                const tagIds = tags.map((tag) => tag.tag_id);
                const {data: tagData, error: tagDataError} = await supabase
                    .from('tags')
                    .select('name')
                    .in('id', tagIds);

                if (tagDataError) {
                    console.error(tagDataError);
                    res.status(500).json({message: 'Internal server error', code: 500});
                    return;
                }
                const tagNames = tagData.map((tag) => tag.name);
                review.tags = tagNames;

                const {data: ratings, error: ratingsError} = await supabase
                    .from('ratings')
                    .select('*')
                    .eq('review_id', review.id);

                if (ratingsError) {
                    console.error(ratingsError);
                    res.status(500).json({message: 'Internal server error', code: 500});
                    return;
                }
                const ratingScores = ratings.map((rating) => rating.value);
                const ratingUsers = ratings.map((rating) => rating.user_id);
                const avgRating = ratingScores.reduce((acc, curr) => acc + curr, 0) / ratingScores.length;
                if (!review.rating) {
                    review.rating = {};
                }
                review.rating.avgRating = avgRating;
                review.rating.ratingUsers = ratingUsers;

                const {data: likes, error: likesError} = await supabase
                    .from('likes')
                    .select('user_id')
                    .eq('review_id', review.id);

                if (likesError) {
                    console.error(likesError);
                    res.status(500).json({message: 'Internal server error', code: 500});
                    return;
                }

                const likeUsers = likes.map((like) => like.user_id);
                review.likes = likeUsers;
            }
            res.status(200).json({message: 'Last three reviews', data: reviews, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getPopularTags(req: any, res: any) {
        try {
            const {data, error} = await supabase.from('tags')
                .select('name, review_tags!inner(tag_id)')

            if (error) {
                console.log("error")
                return []
            }
            const sortData = data.sort((a: PopularTag, b: PopularTag) => {
                const aLength = Array.isArray(a.review_tags) ? a.review_tags.length : 0;
                const bLength = Array.isArray(b.review_tags) ? b.review_tags.length : 0;
                return bLength - aLength;
            });
            const popularTags = sortData.slice(0, 15).map(t => t.name)

            res.status(200).json({message: 'Popular tags', data: popularTags, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async createReview(req: any, res: any) {
        try {
            upload.single('reviewImage')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const file = req.file;
                const {title, review_title, body, category, assessment, author_id, tags, author_name} = req.body;
                let downloadURL;
                let newReviewId: any;

                if (file) {
                    const storageRef = ref(storage, `review-manager/${author_id}/${file.originalname}`)
                    const metadata = {contentType: file.mimeType}
                    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
                    downloadURL = await getDownloadURL(snapshot.ref)

                    const {data, error} = await supabase
                        .from('reviews')
                        .insert({
                            title,
                            review_title,
                            body,
                            category,
                            assessment,
                            author_id,
                            author_name,
                            image: downloadURL
                        })
                        .select('id')
                        .single();
                    if (error) {
                        console.log(error);
                    }
                    newReviewId = data!.id;

                } else {
                    const {data, error} = await supabase
                        .from('reviews')
                        .insert({title, review_title, body, category, assessment, author_id, author_name})
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
                                .single<{ id: string }>();
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

    async setRating(req: any, res: any) {
        try {
            const {userId, reviewId, value} = req.body
            const {data, error} = await supabase
                .from('ratings')
                .insert({value, review_id: reviewId, user_id: userId});

            if (error) {
                throw error;
            }
            res.status(200).json({message: 'Set rating', code: 200});
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Logout error', code: 400})
        }
    }

    async changeLikeStatus(req: any, res: any) {
        try {
            const {userId, reviewId} = req.body;
            const {data: existingLike, error} = await supabase
                .from('likes')
                .select('id')
                .eq('user_id', userId)
                .eq('review_id', reviewId)
                .single();

            if (existingLike === null) {
                const { data: newLike, error: insertError } = await supabase
                    .from('likes')
                    .insert({ user_id: userId, review_id: reviewId })
                    .single();

                if (insertError) {
                    throw insertError;
                }

                res.status(200).json({ message: 'Like added', code: 200 });
            } else {
                const { data: deletedLike, error: deleteError } = await supabase
                    .from('likes')
                    .delete()
                    .eq('id', existingLike.id)
                    .single();

                if (deleteError) {
                    throw deleteError;
                }

                res.status(200).json({ message: 'Like removed', code: 200 });
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Logout error', code: 400})
        }
    }
}

module.exports = new reviewController()

interface PopularTag {
    name: string;
    review_tags: ({ tag_id: any } | { tag_id: any }[]) | null;
}