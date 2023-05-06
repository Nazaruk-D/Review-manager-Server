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
exports.uploadImage = void 0;
const storage_1 = require("firebase/storage");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const firebase_1 = require("./firebase");
function uploadImage(file, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let downloadURL;
            if (file) {
                const storageRef = (0, storage_1.ref)(firebase_1.storage, `review-manager/${req.body.author_id}/${file.originalname}`);
                const metadata = { contentType: file.mimeType };
                const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
                downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
            }
            return downloadURL;
        }
        catch (_a) {
            console.log("error");
            return;
        }
    });
}
exports.uploadImage = uploadImage;
