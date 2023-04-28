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
exports.uploadImageAndUpdateDatabase = void 0;
const uploadImage_1 = require("./uploadImage");
const supabase_1 = require("../supabase");
function uploadImageAndUpdateDatabase(file, req, reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadURL = yield (0, uploadImage_1.uploadImage)(file, req);
        console.log("downloadURLdownloadURL: ", downloadURL);
        const { data, error } = yield supabase_1.supabase
            .from('reviews')
            .update({
            image: downloadURL,
        })
            .eq('id', reviewId)
            .single();
        if (error) {
            throw error;
        }
        return data;
    });
}
exports.uploadImageAndUpdateDatabase = uploadImageAndUpdateDatabase;
