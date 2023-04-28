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
exports.deleteRating = void 0;
const supabase_1 = require("../supabase");
function deleteRating(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: ratingsToDelete, error } = yield supabase_1.supabase
            .from("ratings")
            .select("*")
            .eq("review_id", reviewId);
        if (error) {
            console.error(error);
            throw new Error("Internal server error");
        }
        if (ratingsToDelete && ratingsToDelete.length > 0) {
            const { error } = yield supabase_1.supabase
                .from("ratings")
                .delete()
                .eq("review_id", reviewId);
            if (error) {
                console.error(error);
                throw new Error("Internal server error");
            }
        }
    });
}
exports.deleteRating = deleteRating;
