import {supabase} from "../supabase/supabase";
import {fetchUserData} from "../utils/fetch/fetchUserData";
import {uploadImage} from "../utils/image/uploadImage";
import {updateUserPhoto} from "../utils/update/updateUserPhoto";
import {updateUserName} from "../utils/update/updateUserName";
import { Request, Response } from "express";
import {fetchTotalLikesByUser} from "../utils/fetch/fetchTotalLikesByUser";

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

class UsersController {

    async fetchUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const user = await fetchUserData(userId);
            const totalLikes = await fetchTotalLikesByUser(userId);
            if (user) {
                user.totalLikes = totalLikes;
            }
            return res.status(200).send({message: 'Getting user data successfully', data: user, statusCode: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async uploadProfileInfo(req: { file?: any, body: { userId: string, newName?: string } }, res: Response) {
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
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async fetchUsers(req: Request, res: Response)  {
        try {
            const {data: users, error: reviewError} = await supabase
                .from('users')
                .select('*')
            return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new UsersController();
