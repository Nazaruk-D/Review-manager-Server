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
const supabase_1 = require("../supabase/supabase");
const getUsersByLikes_1 = require("../utils/getUsersByLikes");
const getUsersByRatings_1 = require("../utils/getUsersByRatings");
const getTagsByReviewId_1 = require("../utils/getTagsByReviewId");
const getReviewById_1 = require("../utils/getReviewById");
const getLatestReviews_1 = require("../utils/getLatestReviews");
const getPopularReviews_1 = require("../utils/getPopularReviews");
const getTags_1 = require("../utils/getTags");
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
const fetchUsersReviews_1 = require("../utils/fetchUsersReviews");
const addImageToDatabase_1 = require("../utils/addImageToDatabase");
const fetchImagesByReviewId_1 = require("../utils/fetchImagesByReviewId");
const deleteImagesByReviewId_1 = require("../utils/deleteImagesByReviewId");
const addProductName_1 = require("../utils/addProductName");
const fetchReviewDataById_1 = require("../utils/fetchReviewDataById");
const fetchProductsDataByReviewId_1 = require("../utils/fetchProductsDataByReviewId");
const deleteReviewProductsByReviewId_1 = require("../utils/deleteReviewProductsByReviewId");
const updateProductName_1 = require("../utils/updateProductName");
const getProductNames_1 = require("../utils/getProductNames");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
class reviewController {
    getUserReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const reviews = yield (0, fetchUsersReviews_1.fetchUsersReviews)(userId);
                const reviewsWithData = yield Promise.all(reviews.map((review) => __awaiter(this, void 0, void 0, function* () {
                    const reviewData = yield (0, fetchReviewDataById_1.fetchReviewDataById)(review.id);
                    return reviewData;
                })).reverse());
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
                const images = yield (0, fetchImagesByReviewId_1.fetchImagesByReviewId)(review.id);
                const { title, assessment } = yield (0, fetchProductsDataByReviewId_1.fetchProductsDataByReviewId)(review.id);
                review.title = title;
                review.assessment = assessment;
                review.tags = tagNames;
                review.likes = likedUserIds;
                review.ratings = ratedUserIds;
                review.images = images;
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
                yield (0, deleteImagesByReviewId_1.deleteImagesByReviewId)(reviewId);
                yield (0, deleteReviewProductsByReviewId_1.deleteReviewProductsByReviewId)(reviewId);
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
                const popularTags = yield (0, getTags_1.getTags)();
                res.status(200).json({ message: 'Popular tags', data: popularTags, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getProductNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productNames = yield (0, getProductNames_1.getProductNames)();
                res.status(200).json({ message: 'Product names', data: productNames, code: 200 });
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
                upload.array('reviewImage')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).json({ message: 'Unexpected error' });
                    }
                    const files = req.files;
                    if (files.length > 3) {
                        return res.status(400).send({ message: "You can't attach more than 3 photos" });
                    }
                    const downloadURLs = yield Promise.all(files.map((file) => (0, uploadImage_1.uploadImage)(file, req)));
                    const newReviewId = yield (0, addReviewToDatabase_1.addReviewToDatabase)(req);
                    yield (0, addTags_1.addTags)(req.body.tags, newReviewId);
                    yield (0, addProductName_1.addProductName)(req.body.title, req.body.assessment, newReviewId);
                    yield (0, addImageToDatabase_1.addImageToDatabase)(downloadURLs, newReviewId);
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
                upload.array('reviewImage')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const files = req.files;
                    const reviewId = req.body.reviewId;
                    const downloadURLs = yield Promise.all(files.map((file) => (0, uploadImage_1.uploadImage)(file, req)));
                    yield (0, updateReview_1.updateReview)(req);
                    yield (0, updateProductName_1.updateProductName)(req.body.title, req.body.assessment, reviewId);
                    yield (0, updateReviewTags_1.updateReviewTags)(req.body.tags, reviewId);
                    if (files.length > 0) {
                        yield (0, deleteImagesByReviewId_1.deleteImagesByReviewId)(reviewId);
                        yield (0, addImageToDatabase_1.addImageToDatabase)(downloadURLs, reviewId);
                    }
                    if (files.length > 3) {
                        return res.status(400).send({ message: "You can't attach more than 3 photos" });
                    }
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
