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
exports.getTagsByReviewId = void 0;
const supabase_1 = require("../supabase/supabase");
function getTagsByReviewId(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: tags, error: tagsError } = yield supabase_1.supabase
            .from('review_tags')
            .select('tag_id')
            .eq('review_id', reviewId);
        if (tagsError) {
            console.error(tagsError);
            throw new Error('Internal server error');
        }
        const tagIds = tags.map((tag) => tag.tag_id);
        const { data: tagData, error: tagDataError } = yield supabase_1.supabase
            .from('tags')
            .select('name')
            .in('id', tagIds);
        if (tagDataError) {
            console.error(tagDataError);
            throw new Error('Internal server error');
        }
        const tagNames = tagData.map((tag) => tag.name);
        return tagNames;
    });
}
exports.getTagsByReviewId = getTagsByReviewId;
