const ReviewRouter = require('express')
const rController = require('../controllers/reviewController')
const reviewRouter = new ReviewRouter()

const reviewEndPoints = {
    review: '/',
    getReviews: '/:userId',
    getReviewById: '/get-review/:reviewId',
}


reviewRouter.get(reviewEndPoints.getReviews, rController.getReviews)
reviewRouter.get(reviewEndPoints.getReviewById, rController.getReviewById)
reviewRouter.post(reviewEndPoints.review, rController.createReview)



module.exports = reviewRouter