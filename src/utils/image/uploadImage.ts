import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
import {storage} from "../../firebase/firebase";

export async function uploadImage(file: any, req: any) {
    try {
        let downloadURL;
        if (file) {
            const userId = req.body.author_id || req.body.userId
            const storageRef = ref(storage, `review-manager/${userId}/${file.originalname}`)
            const metadata = {contentType: file.mimeType}
            const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
            downloadURL = await getDownloadURL(snapshot.ref)
        }
        return downloadURL;
    } catch {
        console.log("error")
        return
    }
}