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
exports.fetchReviewImages = void 0;
const supabase_1 = require("../supabase/supabase");
function fetchReviewImages(reviewId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { data: images, error } = yield supabase_1.supabase
            .from('images')
            .select('url')
            .eq('review_id', reviewId);
        if (error)
            throw error;
        return (_a = images === null || images === void 0 ? void 0 : images.map(image => image.url)) !== null && _a !== void 0 ? _a : [];
    });
}
exports.fetchReviewImages = fetchReviewImages;
function addReviewImagesToReview(review) {
    return __awaiter(this, void 0, void 0, function* () {
        return Object.assign(Object.assign({}, review), { images });
    });
}
