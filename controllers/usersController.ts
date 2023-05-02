import {supabase} from "../supabase/supabase";
import {fetchUserData} from "../utils/fetchUserData";
import {getTotalLikesByUser} from "../utils/getTotalLikesByUser";
import {uploadImage} from "../utils/uploadImage";
import {updateUserPhoto} from "../utils/updateUserPhoto";
import {updateUserName} from "../utils/updateUserName";

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

class UsersController {

    async fetchUser(req: any, res: any) {
        try {
            const userId = req.params.userId;
            const user = await fetchUserData(userId);
            const totalLikes = await getTotalLikesByUser(userId);
            if (user) {
                user.totalLikes = totalLikes;
            }
            return res.status(200).send({message: 'Getting user data successfully', data: user, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async uploadProfileInfo(req: { file?: any, body: { userId: string, newName?: string } }, res: any) {
        try {
            upload.single('profilePhoto')(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                const file = req.file;
                const {newName, userId} = req.body;
                const downloadURL = await uploadImage(file, req)
                if (downloadURL) {
                    await updateUserPhoto(downloadURL, userId)
                }
                if (newName) {
                    await updateUserName(newName, userId)
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
            const {data: users, error: reviewError} = await supabase
                .from('users')
                .select('*')
            return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new UsersController();
