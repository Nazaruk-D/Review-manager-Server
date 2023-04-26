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
const supabase_1 = require("../supabase");
class CommentsController {
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            try {
                const { data: comments, error } = yield supabase_1.supabase
                    .from('comments')
                    .select('*, users!inner(*)')
                    .eq('review_id', reviewId)
                    .order('created_at', { ascending: true });
                if (error) {
                    console.log(error);
                    return null;
                }
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
                const { data, error } = yield supabase_1.supabase
                    .from('comments')
                    .insert([{ review_id, author_id, body }]);
                if (error) {
                    console.log(error);
                    return null;
                }
                return res.status(201).send({ message: 'Comment created successfully', data: req.body, statusCode: 201 });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
module.exports = new CommentsController();
