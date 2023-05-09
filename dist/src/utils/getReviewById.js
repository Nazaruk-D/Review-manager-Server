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
exports.getReviewById = void 0;
const supabase_1 = require("../supabase/supabase");
function getReviewById(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: review, error: reviewError } = yield supabase_1.supabase
            .from('reviews')
            .select('id, author_id, body, review_title, category, avg_rating, created_at')
            .eq('id', reviewId)
            .single();
        if (reviewError) {
            console.error(reviewError);
            throw new Error('Internal server error');
        }
        return review;
    });
}
exports.getReviewById = getReviewById;
