import {supabase} from "../supabase";

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
import {getUsersByLikes} from "../utils/getUsersByLikes";
import {getUsersByRatings} from "../utils/getUsersByRatings";
import {getTagsByReviewId} from "../utils/getTagsByReviewId";
import {getReviewById} from "../utils/getReviewById";
import {getLatestReviews} from "../utils/getLatestReviews";
import {getPopularReviews} from "../utils/getPopularReviews";
import {getPopularTags} from "../utils/getPopularTags";
import {getExistingRating} from "../utils/getExistingRating";
import {uploadImage} from "../utils/uploadImage";
import {addReviewToDatabase} from "../utils/addReviewToDatabase";
import {addTags} from "../utils/addTags";
import {updateReview} from "../utils/updateReview";
import {updateReviewTags} from "../utils/updateReviewTags";
import {deleteTags} from "../utils/deleteTags";
import {deleteRating} from "../utils/deleteRating";
import {deleteComments} from "../utils/deleteComments";
import {deleteLikes} from "../utils/deleteLikes";
import {deleteReview} from "../utils/deleteReview";
import {getTotalLikesByUser} from "../utils/getTotalLikesByUser";
import {addReviewMetadata} from "../utils/addReviewMetadata";
import {fetchUsersReviews} from "../utils/fetchUsersReviews";
import {fetchLikesByReviewIds} from "../utils/fetchLikesByReviewIds";


class reviewController {
    async getUserReviews(req: any, res: any) {
        try {
            const userId = req.params.userId;
            const reviews = await fetchUsersReviews(userId)
            const reviewIds = reviews!.map(review => review.id);
            const likes = await fetchLikesByReviewIds(reviewIds)
            const reviewsWithData = reviews!.map((review) => {
                const reviewLikes = likes!.filter(like => like.review_id === review.id);
                return {
                    ...review,
                    likes: reviewLikes,
                };
            }).reverse();
            res.status(200).json({message: 'Reviews', data: reviewsWithData, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getReviewById(req: any, res: any) {
        try {
            const reviewId = req.params.reviewId;
            const review = await getReviewById(reviewId)
            const tagNames = await getTagsByReviewId(review.id)
            const likedUserIds = await getUsersByLikes(review.id);
            const ratedUserIds = await getUsersByRatings(review.id);
            review.tags = tagNames;
            review.likes = likedUserIds;
            review.ratings = ratedUserIds;
            res.status(200).json({message: 'Review', data: {...review}, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async deleteReviewById(req: any, res: any) {
        try {
            const reviewId = req.body.reviewId;
            await deleteTags(reviewId)
            await deleteRating(reviewId)
            await deleteComments(reviewId)
            await deleteLikes(reviewId)
            await deleteReview(reviewId)

            res.status(200).json({message: 'Review deletion was successful', code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getLatestReviews(req: any, res: any) {
        try {
            const reviews = await getLatestReviews()
            const reviewsWithMetadata = await Promise.all(reviews.map(addReviewMetadata));
            res.status(200).json({message: 'Last three reviews', data: reviewsWithMetadata, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getPopularReviews(req: any, res: any) {
        try {
            const reviews = await getPopularReviews()
            const reviewsWithMetadata = await Promise.all(reviews.map(addReviewMetadata));
            res.status(200).json({message: 'Most popular three reviews', data: reviewsWithMetadata, code: 200});
        } catch (e) {
            console.log(e);
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getPopularTags(req: any, res: any) {
        try {
            const popularTags = await getPopularTags()
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
                const downloadURL = await uploadImage(file, req);
                const newReviewId = await addReviewToDatabase(req, downloadURL);
                await addTags(req.body.tags, newReviewId);
                res.status(201).json({message: 'Review added', code: 201});
            })
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Error when trying to add a new review', code: 400});
        }
    }

    async updateReview(req: any, res: any) {
        try {
            upload.single('reviewImage')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const file = req.file;
                const reviewId = req.body.reviewId;
                const downloadURL = await uploadImage(file, req);
                await updateReview(req, downloadURL)
                await updateReviewTags(req.body.tags, reviewId);
                res.status(200).json({message: 'Review updated', code: 200});
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Review update error', code: 400});
        }
    }

    async setRating(req: any, res: any) {
        try {
            const {userId, reviewId, value} = req.body;
            const existingRating = await getExistingRating(userId, reviewId)
            if (existingRating) {
                const {data: updatedRating, error: updatedRatingError} = await supabase
                    .from('ratings')
                    .update({value})
                    .eq('id', existingRating.id)
                    .single();

                if (updatedRatingError) {
                    console.error(updatedRatingError);
                    res.status(500).json({message: 'Internal server error', code: 500});
                    return;
                }
            } else {
                const {data, error} = await supabase
                    .from('ratings')
                    .insert({value, review_id: reviewId, user_id: userId});
                if (error) {
                    throw error;
                }
            }

            const {data: reviews, error: reviewsError} = await supabase
                .from('reviews')
                .select('*, ratings(value)')
                .eq('id', reviewId);

            if (reviewsError) {
                console.error(reviewsError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            const review = reviews[0];
            const ratingValues = review.ratings.map((rating: any) => rating.value);
            const avgRating = ratingValues.reduce((acc: any, curr: any) => acc + curr, 0) / ratingValues.length;

            const {data: updatedReview, error: updatedReviewError} = await supabase
                .from('reviews')
                .update({avg_rating: avgRating})
                .eq('id', reviewId)
                .single();

            if (updatedReviewError) {
                console.error(updatedReviewError);
                res.status(500).json({message: 'Internal server error', code: 500});
                return;
            }

            res.status(200).json({message: 'Set rating', code: 200});
        } catch (e) {
            console.error(e);
            res.status(400).json({message: 'Logout error', code: 400});
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
                const {data: newLike, error: insertError} = await supabase
                    .from('likes')
                    .insert({user_id: userId, review_id: reviewId})
                    .single();

                if (insertError) {
                    throw insertError;
                }

                res.status(200).json({message: 'Like added', code: 200});
            } else {
                const {data: deletedLike, error: deleteError} = await supabase
                    .from('likes')
                    .delete()
                    .eq('id', existingLike.id)
                    .single();

                if (deleteError) {
                    throw deleteError;
                }
                res.status(200).json({message: 'Like removed', code: 200});
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Logout error', code: 400})
        }
    }
}

module.exports = new reviewController()

