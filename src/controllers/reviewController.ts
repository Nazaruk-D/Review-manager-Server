import {supabase} from "../supabase/supabase";
import {getUsersByLikes} from "../utils/getUsersByLikes";
import {getUsersByRatings} from "../utils/getUsersByRatings";
import {getTagsByReviewId} from "../utils/getTagsByReviewId";
import {getReviewById} from "../utils/getReviewById";
import {getLatestReviews} from "../utils/getLatestReviews";
import {getPopularReviews} from "../utils/getPopularReviews";
import {getTags} from "../utils/getTags";
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
import {addReviewMetadata} from "../utils/addReviewMetadata";
import {fetchUsersReviews} from "../utils/fetchUsersReviews";
import {addImageToDatabase} from "../utils/addImageToDatabase";
import {fetchImagesByReviewId} from "../utils/fetchImagesByReviewId";
import {deleteImagesByReviewId} from "../utils/deleteImagesByReviewId";
import {addProductName} from "../utils/addProductName";
import {fetchReviewDataById} from "../utils/fetchReviewDataById";
import {fetchProductsDataByReviewId} from "../utils/fetchProductsDataByReviewId";
import {deleteReviewProductsByReviewId} from "../utils/deleteReviewProductsByReviewId";
import {updateProductName} from "../utils/updateProductName";
import {getProductNames} from "../utils/getProductNames";

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

class reviewController {

    async getUserReviews(req: any, res: any) {
        try {
            const userId = req.params.userId;
            const reviews = await fetchUsersReviews(userId);
            const reviewsWithData = await Promise.all(reviews!.map(async review => {
                const reviewData = await fetchReviewDataById(review.id);
                return reviewData;
            }).reverse());
            res.status(200).json({message: 'Reviews', data: reviewsWithData, code: 200});
        } catch (e) {
            console.log(e);
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
            const images = await fetchImagesByReviewId(review.id)
            const {title, assessment} = await fetchProductsDataByReviewId(review.id)
            review.title = title;
            review.assessment = assessment;
            review.tags = tagNames;
            review.likes = likedUserIds;
            review.ratings = ratedUserIds;
            review.images = images;
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
            await deleteImagesByReviewId(reviewId)
            await deleteReviewProductsByReviewId(reviewId)
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
            const popularTags = await getTags()
            res.status(200).json({message: 'Popular tags', data: popularTags, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getProductNames(req: any, res: any) {
        try {
            const productNames = await getProductNames()
            res.status(200).json({message: 'Product names', data: productNames, code: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async createReview(req: any, res: any) {
        try {
            upload.array('reviewImage')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).json({message: 'Unexpected error'});
                }
                const files = req.files;
                if (files.length > 3) {
                    return res.status(400).send({message: "You can't attach more than 3 photos"});
                }
                const downloadURLs = await Promise.all(files.map((file: File) => uploadImage(file, req)));
                const newReviewId = await addReviewToDatabase(req);
                await addTags(req.body.tags, newReviewId);
                await addProductName(req.body.title, req.body.assessment, newReviewId)
                await addImageToDatabase(downloadURLs, newReviewId)
                res.status(201).json({message: 'Review added', code: 201});
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Error when trying to add a new review', code: 400});
        }
    }

    async updateReview(req: any, res: any) {
        try {
            upload.array('reviewImage')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const files = req.files;
                const reviewId = req.body.reviewId;
                const downloadURLs = await Promise.all(files.map((file: File) => uploadImage(file, req)));
                await updateReview(req)
                await updateProductName(req.body.title, req.body.assessment, reviewId)
                await updateReviewTags(req.body.tags, reviewId);
                if (files.length > 0) {
                    await deleteImagesByReviewId(reviewId);
                    await addImageToDatabase(downloadURLs, reviewId);
                }
                if (files.length > 3) {
                    return res.status(400).send({message: "You can't attach more than 3 photos"});
                }
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

