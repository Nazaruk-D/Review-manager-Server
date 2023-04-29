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
exports.addReviewMetadata = void 0;
const getUsersByLikes_1 = require("./getUsersByLikes");
const getUsersByRatings_1 = require("./getUsersByRatings");
const getTotalLikesByUser_1 = require("./getTotalLikesByUser");
function addReviewMetadata(review) {
    return __awaiter(this, void 0, void 0, function* () {
        const likedUserIds = yield (0, getUsersByLikes_1.getUsersByLikes)(review.id);
        const ratedUserIds = yield (0, getUsersByRatings_1.getUsersByRatings)(review.id);
        const totalAuthorLikes = yield (0, getTotalLikesByUser_1.getTotalLikesByUser)(review.author_id);
        review.likes = likedUserIds;
        review.ratings = ratedUserIds;
        review.authorLikes = totalAuthorLikes;
        return review;
    });
}
exports.addReviewMetadata = addReviewMetadata;
