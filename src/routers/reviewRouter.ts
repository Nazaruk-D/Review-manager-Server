import {EndPoints} from "../enum/endPoints";
const ReviewRouter = require('express')
const rController = require('../controllers/reviewController')
const reviewRouter = new ReviewRouter()


reviewRouter.get(EndPoints.getProductNames, rController.getProductNames)
reviewRouter.get(EndPoints.getLatestReviews, rController.getLatestReviews)
reviewRouter.get(EndPoints.getPopularReviews, rController.getPopularReviews)
reviewRouter.get(EndPoints.getPopularTags, rController.getPopularTags)
reviewRouter.get(EndPoints.reviewId, rController.getReviewById)
reviewRouter.get(EndPoints.getReviews, rController.getUserReviews)
reviewRouter.post(EndPoints.setRating, rController.setRating)
reviewRouter.post(EndPoints.changeLikeStatus, rController.changeLikeStatus)
reviewRouter.post(EndPoints.createReview, rController.createReview)
reviewRouter.post(EndPoints.updateReview, rController.updateReview)
reviewRouter.delete(EndPoints.review, rController.deleteReviewById)

module.exports = reviewRouter