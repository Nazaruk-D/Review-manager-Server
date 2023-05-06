"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndPoints = void 0;
var EndPoints;
(function (EndPoints) {
    EndPoints["getTags"] = "/";
    EndPoints["getComments"] = "/:reviewId";
    EndPoints["deleteComments"] = "/:commentId";
    EndPoints["search"] = "/:value";
    EndPoints["uploadProfileInfo"] = "/upload-info";
    EndPoints["getUsers"] = "/get-users";
    EndPoints["getUser"] = "/get-user/:userId";
    EndPoints["changeAdminStatus"] = "/change-role";
    EndPoints["changeIsBlockedStatus"] = "/change-status";
    EndPoints["deleteUser"] = "/delete-user/:userId";
    EndPoints["review"] = "/";
    EndPoints["getLatestReviews"] = "/last-reviews";
    EndPoints["getPopularReviews"] = "/popular-reviews";
    EndPoints["getPopularTags"] = "/get-popular-tags";
    EndPoints["getReviews"] = "/get-reviews/:userId";
    EndPoints["reviewId"] = "/:reviewId";
    EndPoints["setRating"] = "/rating";
    EndPoints["changeLikeStatus"] = "/like";
    EndPoints["createReview"] = "/create-review";
    EndPoints["updateReview"] = "/update-review";
})(EndPoints = exports.EndPoints || (exports.EndPoints = {}));
