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
exports.fetchSimilarReviews = void 0;
const supabase_1 = require("../supabase/supabase");
function fetchSimilarReviews(product_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: reviewProductQuery } = yield supabase_1.supabase
            .from("review_products")
            .select("review_id")
            .in("product_id", [product_id]);
        const { data: similarReviews, error: similarReviewsError } = yield supabase_1.supabase
            .from("reviews")
            .select("id, author_id, created_at, review_title, author_name, avg_rating")
            .in("id", reviewProductQuery.map(review => review.review_id));
        if (similarReviewsError) {
            console.error(similarReviewsError);
            return [];
        }
        return similarReviews;
    });
}
exports.fetchSimilarReviews = fetchSimilarReviews;
