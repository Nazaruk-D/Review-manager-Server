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
exports.fetchProductsAndAssessmentByReviewId = void 0;
const supabase_1 = require("../supabase/supabase");
function fetchProductsAndAssessmentByReviewId(reviewIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: products, error } = yield supabase_1.supabase
            .from('review_products')
            .select('id, name, assessment')
            .in('review_id', reviewIds);
        if (error) {
            throw error;
        }
        return products;
    });
}
exports.fetchProductsAndAssessmentByReviewId = fetchProductsAndAssessmentByReviewId;
