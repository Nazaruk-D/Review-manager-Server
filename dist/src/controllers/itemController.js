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
const getTags_1 = require("../utils/getTags");
const getCommentByReview_1 = require("../utils/getCommentByReview");
const createComment_1 = require("../utils/createComment");
const supabase_1 = require("../supabase/supabase");
const addReviewMetadata_1 = require("../utils/addReviewMetadata");
class ItemController {
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = req.params.value;
                const { data: reviews, error: reviewError } = yield supabase_1.supabase
                    .rpc('search_reviews_tags_comments', { query_text: value });
                const reviewsWithMetadata = yield Promise.all(reviews.map(addReviewMetadata_1.addReviewMetadata));
                if (reviewError) {
                    console.log(reviewError);
                    return;
                }
                return res.status(200).send({
                    message: 'Found reviews on request received successfully',
                    data: reviewsWithMetadata,
                    statusCode: 200
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield (0, getTags_1.getTags)();
                return res.status(200).send({ message: 'Getting tags successfully', data: tags, statusCode: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            try {
                const comments = yield (0, getCommentByReview_1.getCommentByReview)(reviewId);
                return res.status(200).send({ message: 'Getting comments successfully', data: comments, statusCode: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { author_id, review_id, body } = req.body;
            try {
                const data = yield (0, createComment_1.createComment)(review_id, author_id, body);
                return res.status(201).send({ message: 'Comment created successfully', data, statusCode: 201 });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
module.exports = new ItemController();
