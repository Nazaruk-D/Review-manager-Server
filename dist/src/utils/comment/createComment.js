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
exports.createComment = void 0;
const supabase_1 = require("../../supabase/supabase");
function createComment(review_id, author_id, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('comments')
            .insert([{ review_id, author_id, body }]);
        if (error) {
            console.log(error);
            return null;
        }
        return data;
    });
}
exports.createComment = createComment;
