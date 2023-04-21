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
const supabase_1 = require("../supabase");
const firebase_1 = require("../utils/firebase");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const storage_1 = require("firebase/storage");
class UsersController {
    uploadProfileInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                upload.single('profilePhoto')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const file = req.file;
                    const newName = req.body.newName;
                    const userId = req.body.userId;
                    let downloadURL;
                    if (file) {
                        const storageRef = (0, storage_1.ref)(firebase_1.storage, `review-manager/${userId}/${file.originalname}`);
                        const metadata = { contentType: file.mimeType };
                        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
                        downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
                        const { data, error } = yield supabase_1.supabase
                            .from('users')
                            .update({ main_photo: downloadURL, small_photo: downloadURL })
                            .match({ id: userId });
                        if (error) {
                            console.log(error);
                        }
                    }
                    if (newName) {
                        const { data, error } = yield supabase_1.supabase
                            .from('users')
                            .update({ user_name: newName })
                            .match({ id: userId });
                        if (error) {
                            console.log(error);
                        }
                    }
                    return res.status(200).send({
                        message: 'Upload profile info successfully',
                        data: { url: downloadURL, newName },
                        statusCode: 200
                    });
                }));
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).send({ message: 'Getting users successfully', data: {}, statusCode: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
}
module.exports = new UsersController();
