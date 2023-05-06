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
exports.deleteLikes = void 0;
const supabase_1 = require("../supabase/supabase");
function deleteLikes(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: likesToDelete, error: likesError } = yield supabase_1.supabase
            .from('likes')
            .select('*')
            .eq('review_id', reviewId);
        if (likesError) {
            throw new Error('Error deleting likes: ' + likesError.message);
        }
        if (likesToDelete && likesToDelete.length > 0) {
            const { error: deleteLikesError } = yield supabase_1.supabase
                .from('likes')
                .delete()
                .eq('review_id', reviewId);
            if (deleteLikesError) {
                throw new Error('Error deleting likes: ' + deleteLikesError.message);
            }
        }
    });
}
exports.deleteLikes = deleteLikes;
