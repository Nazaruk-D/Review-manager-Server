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
exports.addProductName = void 0;
const supabase_1 = require("../supabase/supabase");
function addProductName(title, assessment, newReviewId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const titleLowerCase = title.toLowerCase();
            const titleFormatted = titleLowerCase.charAt(0).toUpperCase() + titleLowerCase.slice(1);
            let productId;
            const { data: productsData } = yield supabase_1.supabase
                .from('products')
                .select('id')
                .eq('name', titleFormatted)
                .limit(1);
            if ((_a = productsData === null || productsData === void 0 ? void 0 : productsData[0]) === null || _a === void 0 ? void 0 : _a.id) {
                productId = (_b = productsData === null || productsData === void 0 ? void 0 : productsData[0]) === null || _b === void 0 ? void 0 : _b.id;
            }
            else {
                const { data: newProductData } = yield supabase_1.supabase
                    .from('products')
                    .insert({ name: titleFormatted })
                    .select("id")
                    .single();
                productId = newProductData === null || newProductData === void 0 ? void 0 : newProductData.id;
            }
            yield supabase_1.supabase
                .from('review_products')
                .insert({
                review_id: newReviewId,
                product_id: productId,
                assessment
            });
            yield supabase_1.supabase.rpc('update_average_assessment', { p_product_id: productId });
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.addProductName = addProductName;
