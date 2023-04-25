"use strict";
const ReviewRouter = require('express');
const rController = require('../controllers/reviewController');
const reviewRouter = new ReviewRouter();
const reviewEndPoints = {
    review: '/',
    getReviews: '/:userId',
    getReviewById: '/get-review/:reviewId',
    getLatestReviews: '/last-reviews',
    getPopularTags: '/get-popular-tags',
    setRating: '/rating',
};
reviewRouter.get(reviewEndPoints.getReviewById, rController.getReviewById);
reviewRouter.get(reviewEndPoints.getLatestReviews, rController.getLatestReviews);
reviewRouter.get(reviewEndPoints.getPopularTags, rController.getPopularTags);
reviewRouter.get(reviewEndPoints.getReviews, rController.getUserReviews);
reviewRouter.post(reviewEndPoints.review, rController.createReview);
reviewRouter.post(reviewEndPoints.setRating, rController.setRating);
module.exports = reviewRouter;
