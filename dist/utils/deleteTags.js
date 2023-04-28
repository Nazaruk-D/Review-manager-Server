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
exports.deleteTags = void 0;
const supabase_1 = require("../supabase");
function deleteTags(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: deletedReviewTags, error } = yield supabase_1.supabase
            .from("review_tags")
            .delete()
            .match({ review_id: reviewId })
            .select("tag_id");
        if (error) {
            console.error(error);
            throw new Error("Internal server error");
        }
        if (deletedReviewTags && deletedReviewTags.length > 0) {
            const tagIds = deletedReviewTags.map((rt) => rt.tag_id);
            const { data: remainingReviewTags, error } = yield supabase_1.supabase
                .from("review_tags")
                .select("tag_id")
                .in("tag_id", tagIds);
            if (error) {
                console.error(error);
                throw new Error("Internal server error");
            }
            const remainingTagIds = remainingReviewTags.map((rt) => rt.tag_id);
            const deletedTagIds = tagIds.filter((id) => !remainingTagIds.includes(id));
            if (deletedTagIds.length > 0) {
                const { error } = yield supabase_1.supabase
                    .from("tags")
                    .delete()
                    .in("id", deletedTagIds);
                if (error) {
                    console.error(error);
                    throw new Error("Internal server error");
                }
            }
        }
    });
}
exports.deleteTags = deleteTags;
