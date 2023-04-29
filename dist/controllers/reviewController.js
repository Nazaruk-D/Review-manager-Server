"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../supabase");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const getUsersByLikes_1 = require("../utils/getUsersByLikes");
const getUsersByRatings_1 = require("../utils/getUsersByRatings");
const getTagsByReviewId_1 = require("../utils/getTagsByReviewId");
const getReviewById_1 = require("../utils/getReviewById");
const getLatestReviews_1 = require("../utils/getLatestReviews");
const getPopularReviews_1 = require("../utils/getPopularReviews");
const getPopularTags_1 = require("../utils/getPopularTags");
const getExistingRating_1 = require("../utils/getExistingRating");
const uploadImage_1 = require("../utils/uploadImage");
const addReviewToDatabase_1 = require("../utils/addReviewToDatabase");
const addTags_1 = require("../utils/addTags");
const updateReview_1 = require("../utils/updateReview");
const updateReviewTags_1 = require("../utils/updateReviewTags");
const deleteTags_1 = require("../utils/deleteTags");
const deleteRating_1 = require("../utils/deleteRating");
const deleteComments_1 = require("../utils/deleteComments");
const deleteLikes_1 = require("../utils/deleteLikes");
const deleteReview_1 = require("../utils/deleteReview");
const addReviewMetadata_1 = require("../utils/addReviewMetadata");
class reviewController {
    getUserReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { data: reviews, error: reviewError } = yield supabase_1.supabase
                    .from('reviews')
                    .select('*')
                    .eq('author_id', userId);
                if (reviewError) {
                    console.error(reviewError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const reviewIds = reviews.map(review => review.id);
                const { data: likes, error: likesError } = yield supabase_1.supabase
                    .from('likes')
                    .select('*')
                    .in('review_id', reviewIds);
                if (likesError) {
                    console.error(likesError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const reviewsWithData = reviews.map((review) => {
                    const reviewLikes = likes.filter(like => like.review_id === review.id);
                    return Object.assign(Object.assign({}, review), { likes: reviewLikes });
                });
                res.status(200).json({ message: 'Reviews', data: reviewsWithData, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getReviewById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewId = req.params.reviewId;
                const review = yield (0, getReviewById_1.getReviewById)(reviewId);
                const tagNames = yield (0, getTagsByReviewId_1.getTagsByReviewId)(review.id);
                const likedUserIds = yield (0, getUsersByLikes_1.getUsersByLikes)(review.id);
                const ratedUserIds = yield (0, getUsersByRatings_1.getUsersByRatings)(review.id);
                review.tags = tagNames;
                review.likes = likedUserIds;
                review.ratings = ratedUserIds;
                res.status(200).json({ message: 'Review', data: Object.assign({}, review), code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    deleteReviewById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewId = req.body.reviewId;
                yield (0, deleteTags_1.deleteTags)(reviewId);
                yield (0, deleteRating_1.deleteRating)(reviewId);
                yield (0, deleteComments_1.deleteComments)(reviewId);
                yield (0, deleteLikes_1.deleteLikes)(reviewId);
                yield (0, deleteReview_1.deleteReview)(reviewId);
                res.status(200).json({ message: 'Review deletion was successful', code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getLatestReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield (0, getLatestReviews_1.getLatestReviews)();
                const reviewsWithMetadata = yield Promise.all(reviews.map(addReviewMetadata_1.addReviewMetadata));
                res.status(200).json({ message: 'Last three reviews', data: reviewsWithMetadata, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getPopularReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield (0, getPopularReviews_1.getPopularReviews)();
                const reviewsWithMetadata = yield Promise.all(reviews.map(addReviewMetadata_1.addReviewMetadata));
                res.status(200).json({ message: 'Most popular three reviews', data: reviewsWithMetadata, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getPopularTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const popularTags = yield (0, getPopularTags_1.getPopularTags)();
                res.status(200).json({ message: 'Popular tags', data: popularTags, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                upload.single('reviewImage')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const file = req.file;
                    const downloadURL = yield (0, uploadImage_1.uploadImage)(file, req);
                    const newReviewId = yield (0, addReviewToDatabase_1.addReviewToDatabase)(req, downloadURL);
                    yield (0, addTags_1.addTags)(req.body.tags, newReviewId);
                    res.status(201).json({ message: 'Review added', code: 201 });
                }));
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Error when trying to add a new review', code: 400 });
            }
        });
    }
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                upload.single('reviewImage')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const file = req.file;
                    const reviewId = req.body.reviewId;
                    const downloadURL = yield (0, uploadImage_1.uploadImage)(file, req);
                    yield (0, updateReview_1.updateReview)(req, downloadURL);
                    yield (0, updateReviewTags_1.updateReviewTags)(req.body.tags, reviewId);
                    res.status(200).json({ message: 'Review updated', code: 200 });
                }));
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Review update error', code: 400 });
            }
        });
    }
    setRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, reviewId, value } = req.body;
                const existingRating = yield (0, getExistingRating_1.getExistingRating)(userId, reviewId);
                if (existingRating) {
                    const { data: updatedRating, error: updatedRatingError } = yield supabase_1.supabase
                        .from('ratings')
                        .update({ value })
                        .eq('id', existingRating.id)
                        .single();
                    if (updatedRatingError) {
                        console.error(updatedRatingError);
                        res.status(500).json({ message: 'Internal server error', code: 500 });
                        return;
                    }
                }
                else {
                    const { data, error } = yield supabase_1.supabase
                        .from('ratings')
                        .insert({ value, review_id: reviewId, user_id: userId });
                    if (error) {
                        throw error;
                    }
                }
                const { data: reviews, error: reviewsError } = yield supabase_1.supabase
                    .from('reviews')
                    .select('*, ratings(value)')
                    .eq('id', reviewId);
                if (reviewsError) {
                    console.error(reviewsError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const review = reviews[0];
                const ratingValues = review.ratings.map((rating) => rating.value);
                const avgRating = ratingValues.reduce((acc, curr) => acc + curr, 0) / ratingValues.length;
                const { data: updatedReview, error: updatedReviewError } = yield supabase_1.supabase
                    .from('reviews')
                    .update({ avg_rating: avgRating })
                    .eq('id', reviewId)
                    .single();
                if (updatedReviewError) {
                    console.error(updatedReviewError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                res.status(200).json({ message: 'Set rating', code: 200 });
            }
            catch (e) {
                console.error(e);
                res.status(400).json({ message: 'Logout error', code: 400 });
            }
        });
    }
    changeLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, reviewId } = req.body;
                const { data: existingLike, error } = yield supabase_1.supabase
                    .from('likes')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('review_id', reviewId)
                    .single();
                if (existingLike === null) {
                    const { data: newLike, error: insertError } = yield supabase_1.supabase
                        .from('likes')
                        .insert({ user_id: userId, review_id: reviewId })
                        .single();
                    if (insertError) {
                        throw insertError;
                    }
                    res.status(200).json({ message: 'Like added', code: 200 });
                }
                else {
                    const { data: deletedLike, error: deleteError } = yield supabase_1.supabase
                        .from('likes')
                        .delete()
                        .eq('id', existingLike.id)
                        .single();
                    if (deleteError) {
                        throw deleteError;
                    }
                    res.status(200).json({ message: 'Like removed', code: 200 });
                }
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Logout error', code: 400 });
            }
        });
    }
}
module.exports = new reviewController();
