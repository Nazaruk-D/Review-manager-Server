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
exports.fetchUsersReviews = void 0;
const supabase_1 = require("../supabase/supabase");
function fetchUsersReviews(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: reviews, error: reviewError } = yield supabase_1.supabase
            .from('reviews')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: true });
        if (reviewError) {
            console.error(reviewError);
            return;
        }
        return reviews || [];
    });
}
exports.fetchUsersReviews = fetchUsersReviews;
