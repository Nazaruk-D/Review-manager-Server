"use strict";
const ReviewRouter = require('express');
const rController = require('../controllers/reviewController');
const reviewRouter = new ReviewRouter();
const reviewEndPoints = {
    review: '/',
    getLatestReviews: '/last-reviews',
    getPopularTags: '/get-popular-tags',
    getReviews: '/get-reviews/:userId',
    reviewById: '/:reviewId',
    setRating: '/rating',
    changeLikeStatus: '/like',
};
reviewRouter.get(reviewEndPoints.getLatestReviews, rController.getLatestReviews);
reviewRouter.get(reviewEndPoints.getPopularTags, rController.getPopularTags);
reviewRouter.get(reviewEndPoints.reviewById, rController.getReviewById);
reviewRouter.get(reviewEndPoints.getReviews, rController.getUserReviews);
reviewRouter.post(reviewEndPoints.review, rController.createReview);
reviewRouter.post(reviewEndPoints.setRating, rController.setRating);
reviewRouter.post(reviewEndPoints.changeLikeStatus, rController.changeLikeStatus);
reviewRouter.delete(reviewEndPoints.reviewById, rController.deleteReviewById);
module.exports = reviewRouter;
