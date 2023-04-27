"use strict";
const ReviewRouter = require('express');
const rController = require('../controllers/reviewController');
const reviewRouter = new ReviewRouter();
const reviewEndPoints = {
    review: '/',
    getLatestReviews: '/last-reviews',
    getPopularTags: '/get-popular-tags',
    getReviews: '/get-reviews/:userId',
    reviewId: '/:reviewId',
    setRating: '/rating',
    changeLikeStatus: '/like',
};
reviewRouter.get(reviewEndPoints.getLatestReviews, rController.getLatestReviews);
reviewRouter.get(reviewEndPoints.getPopularTags, rController.getPopularTags);
reviewRouter.get(reviewEndPoints.reviewId, rController.getReviewById);
reviewRouter.get(reviewEndPoints.getReviews, rController.getUserReviews);
reviewRouter.post(reviewEndPoints.reviewId, rController.createReview);
reviewRouter.post(reviewEndPoints.setRating, rController.setRating);
reviewRouter.post(reviewEndPoints.changeLikeStatus, rController.changeLikeStatus);
reviewRouter.delete(reviewEndPoints.review, rController.deleteReviewById);
module.exports = reviewRouter;
