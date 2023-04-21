import {supabase} from "../supabase";
import {log} from "util";

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Dropbox = require('dropbox').Dropbox;
const fs = require('fs');
const path = require('path');

const dbx = new Dropbox({ accessToken: 'sl.Bc6FBT2N58OM7cePdi36JaHdug2_U2qSc2XmJVIhl2sIVUGzmT3__mUhllVJv3NFEqwl22SGZ-1JC6NWjcdrLMJHdZ_cf-sqM9J9J-JPNOYdI97J7fb4TvP00IkJeSGgGCMp-z_76Ch-' });

class UsersController {
    async uploadProfileInfo(req: {file?: any, body: {userId: string, newName?: string}}, res: any) {
        try {
            upload.single('profilePhoto')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }

                const file = req.file;
                const newName = req.body.newName;
                const userId = req.body.userId;
                let linkResponse;

                if (file) {
                    const path = `/review-manager/${userId}/${file.originalname}`;
                    const response = await dbx.filesUpload({
                        path: path,
                        contents: fs.readFileSync(file.path)
                    });
                    fs.unlinkSync(file.path);
                    linkResponse = await dbx.sharingCreateSharedLink({
                        path: response.result.path_display
                    });
                    const linkImage = linkResponse.result.url.replace('dl=0', 'dl=1');
                    const { data, error } = await supabase
                        .from('users')
                        .update({ main_photo: linkImage, small_photo: linkImage })
                        .match({ id: userId });

                    if (error) {
                        console.log(error);
                    }
                }

                if (newName) {
                    const { data, error } = await supabase
                        .from('users')
                        .update({ user_name: newName })
                        .match({ id: userId });

                    if (error) {
                        console.log(error);
                    }
                }

                return res.status(200).send({
                    message: 'Upload profile info successfully',
                    data: { url: linkResponse?.result.url, newName },
                    statusCode: 200
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    async fetchUsers(req: any, res: any) {
        try {
            return res.status(200).send({message: 'Getting users successfully', data: {}, statusCode: 200});
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new UsersController()