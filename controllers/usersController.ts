import {supabase} from "../supabase";
import {storage} from "../utils/firebase";
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";

class UsersController {
    async uploadProfileInfo(req: { file?: any, body: { userId: string, newName?: string } }, res: any) {
        try {
            upload.single('profilePhoto')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const file = req.file;
                const newName = req.body.newName;
                const userId = req.body.userId;
                let downloadURL;

                if (file) {
                    const storageRef = ref(storage, `review-manager/${userId}/${file.originalname}`)
                    const metadata = {contentType: file.mimeType}
                    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
                    downloadURL = await getDownloadURL(snapshot.ref)
                    const {data, error} = await supabase
                        .from('users')
                        .update({main_photo: downloadURL, small_photo: downloadURL})
                        .match({id: userId});
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
                    data: {url: downloadURL, newName},
                    statusCode: 200
                });
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async fetchUsers(req: any, res: any) {
        try {
            const { data: users, error: reviewError } = await supabase
                .from('users')
                .select('*')
            return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async fetchUser(req: any, res: any) {
        try {
            const userId = req.params.userId;

            const { data: user, error: reviewError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            return res.status(200).send({message: 'Getting user data successfully', data: user, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new UsersController();
