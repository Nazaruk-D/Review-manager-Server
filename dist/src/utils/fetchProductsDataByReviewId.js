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
exports.fetchProductsDataByReviewId = void 0;
const supabase_1 = require("../supabase/supabase");
function fetchProductsDataByReviewId(reviewId) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const { data: products, error } = yield supabase_1.supabase
            .from('products')
            .select('name, avg_assessment, review_products!inner(assessment, product_id)')
            .eq('review_products.review_id', reviewId)
            .single();
        if (error) {
            console.error(error);
            return { title: '', assessment: 0, product_id: 0 };
        }
        const title = products === null || products === void 0 ? void 0 : products.name;
        const avg_assessment = products === null || products === void 0 ? void 0 : products.avg_assessment;
        const assessment = (_c = (_b = (_a = products === null || products === void 0 ? void 0 : products.review_products) === null || _a === void 0 ? void 0 : _a.find(p => p.assessment)) === null || _b === void 0 ? void 0 : _b.assessment) !== null && _c !== void 0 ? _c : 0;
        const product_id = (_f = (_e = (_d = products === null || products === void 0 ? void 0 : products.review_products) === null || _d === void 0 ? void 0 : _d.find(p => p.product_id)) === null || _e === void 0 ? void 0 : _e.product_id) !== null && _f !== void 0 ? _f : 0;
        return { title, assessment, product_id, avg_assessment };
    });
}
exports.fetchProductsDataByReviewId = fetchProductsDataByReviewId;
