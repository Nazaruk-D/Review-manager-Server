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
exports.deleteReviewById = void 0;
const deleteTags_1 = require("./deleteTags");
const deleteRating_1 = require("./deleteRating");
const deleteComments_1 = require("./deleteComments");
const deleteLikes_1 = require("./deleteLikes");
const deleteImagesByReviewId_1 = require("./deleteImagesByReviewId");
const deleteReviewProductsByReviewId_1 = require("./deleteReviewProductsByReviewId");
const deleteReview_1 = require("./deleteReview");
function deleteReviewById(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, deleteTags_1.deleteTags)(reviewId);
            yield (0, deleteRating_1.deleteRating)(reviewId);
            yield (0, deleteComments_1.deleteComments)(reviewId);
            yield (0, deleteLikes_1.deleteLikes)(reviewId);
            yield (0, deleteImagesByReviewId_1.deleteImagesByReviewId)(reviewId);
            yield (0, deleteReviewProductsByReviewId_1.deleteReviewProductsByReviewId)(reviewId);
            yield (0, deleteReview_1.deleteReview)(reviewId);
        }
        catch (error) {
            console.error(error);
            throw new Error('Error');
        }
    });
}
exports.deleteReviewById = deleteReviewById;
