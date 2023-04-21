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
const dropbox_1 = require("../utils/dropbox");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
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
                    let linkResponse;
                    yield (0, dropbox_1.checkAccessToken)();
                    if (file) {
                        const path = `/review-manager/${userId}/${file.originalname}`;
                        const response = yield dropbox_1.dbx.filesUpload({
                            path: path,
                            contents: fs.readFileSync(file.path)
                        });
                        fs.unlinkSync(file.path);
                        linkResponse = yield dropbox_1.dbx.sharingCreateSharedLink({
                            path: response.result.path_display
                        });
                        const linkImage = linkResponse.result.url.replace('dl=0', 'dl=1');
                        const { data, error } = yield supabase_1.supabase
                            .from('users')
                            .update({ main_photo: linkImage, small_photo: linkImage })
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
                        data: { url: linkResponse === null || linkResponse === void 0 ? void 0 : linkResponse.result.url, newName },
                        statusCode: 200
                    });
                }));
            }
            catch (e) {
                console.log(e);
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
            }
        });
    }
}
module.exports = new UsersController();
