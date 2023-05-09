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
exports.fetchReviewDataById = void 0;
const getReviewById_1 = require("./getReviewById");
const getUsersByLikes_1 = require("./getUsersByLikes");
const fetchImagesByReviewId_1 = require("./fetchImagesByReviewId");
const fetchProductsDataByReviewId_1 = require("./fetchProductsDataByReviewId");
function fetchReviewDataById(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const review = yield (0, getReviewById_1.getReviewById)(reviewId);
        const likes = yield (0, getUsersByLikes_1.getUsersByLikes)(review.id);
        const images = yield (0, fetchImagesByReviewId_1.fetchImagesByReviewId)(review.id);
        const { title, assessment } = yield (0, fetchProductsDataByReviewId_1.fetchProductsDataByReviewId)(review.id);
        return Object.assign(Object.assign({}, review), { likes: (likes === null || likes === void 0 ? void 0 : likes.map(like => like.user_id)) || [], images,
            title,
            assessment });
    });
}
exports.fetchReviewDataById = fetchReviewDataById;
