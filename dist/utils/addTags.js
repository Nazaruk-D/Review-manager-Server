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
exports.addTags = void 0;
const supabase_1 = require("../supabase");
function addTags(tags, newReviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof tags === 'string') {
            tags = tags.split(',');
        }
        if (tags && tags.length > 0) {
            try {
                const tagIds = yield Promise.all(tags.map((tag) => __awaiter(this, void 0, void 0, function* () {
                    const { data, error } = yield supabase_1.supabase
                        .from('tags')
                        .select('id')
                        .eq('name', tag)
                        .maybeSingle();
                    if (error) {
                        throw error;
                    }
                    if (!data) {
                        const { data, error: tagError } = yield supabase_1.supabase
                            .from('tags')
                            .insert({ name: tag })
                            .select('id')
                            .maybeSingle();
                        if (tagError)
                            throw tagError;
                        return data === null || data === void 0 ? void 0 : data.id;
                    }
                    return data.id;
                })));
                const reviewTagInserts = tagIds.map((tagId) => {
                    return { review_id: newReviewId, tag_id: tagId };
                });
                const { error: reviewTagError } = yield supabase_1.supabase
                    .from('review_tags')
                    .insert(reviewTagInserts);
                if (reviewTagError)
                    throw reviewTagError;
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
exports.addTags = addTags;
