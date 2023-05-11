import {supabase} from "../supabase/supabase";
import {uploadImage} from "../utils/image/uploadImage";
import {addReviewToDatabase} from "../utils/add/addReviewToDatabase";
import {addTags} from "../utils/add/addTags";
import {updateReview} from "../utils/update/updateReview";
import {updateReviewTags} from "../utils/update/updateReviewTags";
import {addReviewMetadata} from "../utils/add/addReviewMetadata";
import {fetchUsersReviews} from "../utils/fetch/fetchUsersReviews";
import {addImageToDatabase} from "../utils/add/addImageToDatabase";
import {fetchImagesByReviewId} from "../utils/fetch/fetchImagesByReviewId";
import {deleteImagesByReviewId} from "../utils/delete/deleteImagesByReviewId";
import {addProductName} from "../utils/add/addProductName";
import {fetchReviewDataById} from "../utils/fetch/fetchReviewDataById";
import {fetchProductsDataByReviewId} from "../utils/fetch/fetchProductsDataByReviewId";
import {deleteReviewProductsByReviewId} from "../utils/delete/deleteReviewProductsByReviewId";
import {fetchSimilarReviews} from "../utils/fetch/fetchSimilarReviews";
import {deleteReviewById} from "../utils/delete/deleteReviewById";
import { Request, Response } from "express";
import {fetchReviewById} from "../utils/fetch/fetchReviewById";
import {fetchTagsByReviewId} from "../utils/fetch/fetchTagsByReviewId";
import {fetchUsersByLikes} from "../utils/fetch/fetchUsersByLikes";
import {fetchUsersByRatings} from "../utils/fetch/fetchUsersByRatings";
import {Review} from "../types/ReviewType";
import {fetchLatestReviews} from "../utils/fetch/fetchLatestReviews";
import {fetchPopularReviews} from "../utils/fetch/fetchPopularReviews";
import {fetchTags} from "../utils/fetch/fetchTags";
import {fetchProductNames} from "../utils/fetch/fetchProductNames";
import {fetchUsernameById} from "../utils/fetch/fetchUsernameById";
import {fetchExistingRating} from "../utils/fetch/fetchExistingRating";

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

class reviewController {
    async getUserReviews(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const reviews = await fetchUsersReviews(userId);
            const reviewsWithData = await Promise.all(reviews!.map(async review => {
                const reviewData = await fetchReviewDataById(review.id);
                return reviewData;
            }).reverse());
            res.status(200).json({message: 'Reviews', data: reviewsWithData, code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getReviewById(req: Request, res: Response) {
        try {
            const reviewId = req.params.reviewId;
            const review = await fetchReviewById(reviewId)
            const tagNames = await fetchTagsByReviewId(review.id)
            const likedUserIds = await fetchUsersByLikes(review.id);
            const ratedUserIds = await fetchUsersByRatings(review.id);
            const images = await fetchImagesByReviewId(review.id)
            const {title, assessment, product_id, avg_assessment} = await fetchProductsDataByReviewId(review.id)
            const similarReview = await fetchSimilarReviews(product_id)
            review.title = title;
            review.assessment = assessment;
            review.tags = tagNames;
            review.likes = likedUserIds;
            review.ratings = ratedUserIds;
            review.images = images;
            review.avg_assessment = avg_assessment
            review.similarReview = similarReview.filter((review: Review) => review.id !== reviewId)
            res.status(200).json({message: 'Review', data: {...review}, code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async deleteReviewById(req: Request, res: Response) {
        try {
            const reviewId = req.body.reviewId;
            await deleteReviewById(reviewId)
            res.status(200).json({message: 'Review deletion was successful', code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getLatestReviews(req: Request, res: Response) {
        try {
            const reviews = await fetchLatestReviews()
            const reviewsWithMetadata = await Promise.all(reviews.map(addReviewMetadata));
            res.status(200).json({message: 'Last three reviews', data: reviewsWithMetadata, code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getPopularReviews(req: Request, res: Response) {
        try {
            const reviews = await fetchPopularReviews()
            const reviewsWithMetadata = await Promise.all(reviews.map(addReviewMetadata));
            res.status(200).json({message: 'Most popular three reviews', data: reviewsWithMetadata, code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getPopularTags(req: Request, res: Response) {
        try {
            const popularTags = await fetchTags()
            res.status(200).json({message: 'Popular tags', data: popularTags, code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getProductNames(req: Request, res: Response) {
        try {
            const productNames = await fetchProductNames()
            res.status(200).json({message: 'Product names', data: productNames, code: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async createReview(req: any, res: Response) {
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
                const authorName = await fetchUsernameById(req.body.author_id)
                const newReviewId = await addReviewToDatabase(req, authorName);
                await addTags(req.body.tags, newReviewId);
                await addProductName(req.body.title, req.body.assessment, newReviewId)
                await addImageToDatabase(downloadURLs, newReviewId)
                res.status(201).json({message: 'Review added', code: 201});
            });
        } catch (e) {
            res.status(400).json({message: 'Error to add a new review', code: 400});
        }
    }

    async updateReview(req: any, res: Response) {
        try {
            upload.array('reviewImage')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const files = req.files;
                const reviewId = req.body.reviewId;
                const downloadURLs = await Promise.all(files.map((file: File) => uploadImage(file, req)));
                await updateReview(req)
                await deleteReviewProductsByReviewId(reviewId)
                await addProductName(req.body.title, req.body.assessment, reviewId)
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
            res.status(400).json({message: 'Review update error', code: 400});
        }
    }

    async setRating(req: Request, res: Response) {
        try {
            const {userId, reviewId, value} = req.body;
            const existingRating = await fetchExistingRating(userId, reviewId)
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
            res.status(400).json({message: 'Set rating error', code: 400});
        }
    }

    async changeLikeStatus(req: Request, res: Response) {
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
            res.status(400).json({message: 'Change like status', code: 400})
        }
    }
}

module.exports = new reviewController()

