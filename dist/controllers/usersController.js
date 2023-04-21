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
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Dropbox = require('dropbox').Dropbox;
const fs = require('fs');
const path = require('path');
const dbx = new Dropbox({ accessToken: 'sl.Bc6FBT2N58OM7cePdi36JaHdug2_U2qSc2XmJVIhl2sIVUGzmT3__mUhllVJv3NFEqwl22SGZ-1JC6NWjcdrLMJHdZ_cf-sqM9J9J-JPNOYdI97J7fb4TvP00IkJeSGgGCMp-z_76Ch-' });
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
                    if (file) {
                        const path = `/review-manager/${userId}/${file.originalname}`;
                        const response = yield dbx.filesUpload({
                            path: path,
                            contents: fs.readFileSync(file.path)
                        });
                        fs.unlinkSync(file.path);
                        linkResponse = yield dbx.sharingCreateSharedLink({
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
