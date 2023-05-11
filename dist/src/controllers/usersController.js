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
const supabase_1 = require("../supabase/supabase");
const fetchUserData_1 = require("../utils/fetchUserData");
const getTotalLikesByUser_1 = require("../utils/getTotalLikesByUser");
const uploadImage_1 = require("../utils/uploadImage");
const updateUserPhoto_1 = require("../utils/updateUserPhoto");
const updateUserName_1 = require("../utils/updateUserName");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
class UsersController {
    fetchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield (0, fetchUserData_1.fetchUserData)(userId);
                const totalLikes = yield (0, getTotalLikesByUser_1.getTotalLikesByUser)(userId);
                if (user) {
                    user.totalLikes = totalLikes;
                }
                return res.status(200).send({ message: 'Getting user data successfully', data: user, statusCode: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    uploadProfileInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                upload.single('profilePhoto')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const file = req.file;
                    const { newName, userId } = req.body;
                    console.log("file: ", file);
                    const downloadURL = yield (0, uploadImage_1.uploadImage)(file, req);
                    if (downloadURL) {
                        yield (0, updateUserPhoto_1.updateUserPhoto)(downloadURL, userId);
                    }
                    if (newName) {
                        yield (0, updateUserName_1.updateUserName)(newName, userId);
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
                const { data: users, error: reviewError } = yield supabase_1.supabase
                    .from('users')
                    .select('*');
                return res.status(200).send({ message: 'Getting users successfully', data: users, statusCode: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
}
module.exports = new UsersController();
