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
exports.getPopularTags = void 0;
const supabase_1 = require("../supabase");
function getPopularTags() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: tags, error: reviewsError } = yield supabase_1.supabase
            .from('tags')
            .select('name, review_tags!inner(tag_id)');
        if (reviewsError) {
            console.error(reviewsError);
            return [];
        }
        const sortData = tags.sort((a, b) => {
            const aLength = Array.isArray(a.review_tags) ? a.review_tags.length : 0;
            const bLength = Array.isArray(b.review_tags) ? b.review_tags.length : 0;
            return bLength - aLength;
        });
        const popularTags = sortData.slice(0, 15).map(t => t.name);
        return popularTags;
    });
}
exports.getPopularTags = getPopularTags;
