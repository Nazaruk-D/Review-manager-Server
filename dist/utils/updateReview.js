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
exports.updateReview = void 0;
const supabase_1 = require("../supabase/supabase");
function updateReview(req, downloadURL) {
    return __awaiter(this, void 0, void 0, function* () {
        let { author_id, reviewId, title, review_title, body, category, assessment, author_name } = req.body;
        const updateObject = {
            title,
            review_title,
            body,
            category,
            assessment,
            author_id,
            author_name,
        };
        if (downloadURL) {
            updateObject.image = downloadURL;
        }
        const { data, error } = yield supabase_1.supabase
            .from('reviews')
            .update(updateObject)
            .eq('id', reviewId)
            .single();
        if (error) {
            console.error(error);
            throw new Error('Internal server error');
        }
        return data;
    });
}
exports.updateReview = updateReview;
