"use strict";
const ReviewRouter = require('express');
const rController = require('../controllers/reviewController');
const reviewRouter = new ReviewRouter();
const reviewEndPoints = {
    review: '/',
    getReviews: '/:userId',
};
reviewRouter.get(reviewEndPoints.getReviews, rController.getReviews);
reviewRouter.post(reviewEndPoints.review, rController.createReview);
module.exports = reviewRouter;
