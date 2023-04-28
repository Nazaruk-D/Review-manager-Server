"use strict";
const ReviewRouter = require('express');
const rController = require('../controllers/reviewController');
const reviewRouter = new ReviewRouter();
const reviewEndPoints = {
    review: '/',
    getLatestReviews: '/last-reviews',
    getPopularReviews: '/popular-reviews',
    getPopularTags: '/get-popular-tags',
    getReviews: '/get-reviews/:userId',
    reviewId: '/:reviewId',
    setRating: '/rating',
    changeLikeStatus: '/like',
    createReview: '/create-review',
    updateReview: '/update-review',
};
reviewRouter.get(reviewEndPoints.getLatestReviews, rController.getLatestReviews);
reviewRouter.get(reviewEndPoints.getPopularReviews, rController.getPopularReviews);
reviewRouter.get(reviewEndPoints.getPopularTags, rController.getPopularTags);
reviewRouter.get(reviewEndPoints.reviewId, rController.getReviewById);
reviewRouter.get(reviewEndPoints.getReviews, rController.getUserReviews);
reviewRouter.post(reviewEndPoints.setRating, rController.setRating);
reviewRouter.post(reviewEndPoints.changeLikeStatus, rController.changeLikeStatus);
reviewRouter.post(reviewEndPoints.createReview, rController.createReview);
reviewRouter.post(reviewEndPoints.updateReview, rController.updateReview);
reviewRouter.delete(reviewEndPoints.review, rController.deleteReviewById);
module.exports = reviewRouter;
