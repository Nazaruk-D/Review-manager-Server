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
exports.deleteReviewProductsByReviewId = void 0;
const supabase_1 = require("../supabase/supabase");
function deleteReviewProductsByReviewId(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: reviewProducts, error: reviewProductsError } = yield supabase_1.supabase
                .from('review_products')
                .select('product_id')
                .eq('review_id', reviewId);
            if (reviewProductsError) {
                console.error(reviewProductsError);
                return;
            }
            yield supabase_1.supabase.from('review_products').delete().eq('review_id', reviewId);
            if (reviewProducts && reviewProducts.length > 0) {
                const productId = reviewProducts[0].product_id;
                const { data: reviews, error: reviewsError } = yield supabase_1.supabase
                    .from('reviews')
                    .select('product_name')
                    .eq('product_id', productId)
                    .limit(1);
                if (reviewsError) {
                    console.error(reviewsError);
                    return;
                }
                if (!reviews || reviews.length === 0) {
                    yield supabase_1.supabase.from('products').delete().eq('id', productId);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.deleteReviewProductsByReviewId = deleteReviewProductsByReviewId;
