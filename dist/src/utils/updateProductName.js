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
exports.updateProductName = void 0;
const supabase_1 = require("../supabase/supabase");
function updateProductName(title, assessment, reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const titleLowerCase = title.toLowerCase();
            const titleFormatted = titleLowerCase.charAt(0).toUpperCase() + titleLowerCase.slice(1);
            const { data: productsData, error: productsError } = yield supabase_1.supabase
                .from("products")
                .select("id")
                .eq("name", titleFormatted)
                .limit(1);
            if (productsError) {
                throw productsError;
            }
            let productId;
            if (productsData && productsData.length > 0 && productsData[0].id) {
                productId = productsData[0].id;
            }
            else {
                const { data: newProductData, error: newProductError } = yield supabase_1.supabase
                    .from("products")
                    .insert({ name: titleFormatted })
                    .select("id")
                    .single();
                if (newProductError) {
                    throw newProductError;
                }
                productId = newProductData.id;
            }
            yield supabase_1.supabase
                .from("review_products")
                .update({ product_id: productId, assessment })
                .eq('review_id', reviewId)
                .single();
            yield supabase_1.supabase
                .from('');
        }
        catch (error) {
            console.error("Error in updateProductName:", error);
        }
    });
}
exports.updateProductName = updateProductName;
