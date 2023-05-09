export enum EndPoints {
    getTags = '/',
    getComments = '/:reviewId',
    deleteComments = '/:commentId',
    search = '/:value',
    uploadProfileInfo = '/upload-info',
    getUsers = '/get-users',
    getUser = '/get-user/:userId',
    changeAdminStatus = '/change-role',
    changeIsBlockedStatus = '/change-status',
    deleteUser = '/delete-user/:userId',
    review = '/',
    getLatestReviews = '/last-reviews',
    getPopularReviews = '/popular-reviews',
    getPopularTags = '/get-popular-tags',
    getProductNames = '/product-names',
    getReviews = '/get-reviews/:userId',
    reviewId = '/:reviewId',
    setRating = '/rating',
    changeLikeStatus = '/like',
    createReview = '/create-review',
    updateReview = '/update-review',
}
