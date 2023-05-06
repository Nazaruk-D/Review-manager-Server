import {CreateCommentRequest} from "../types/CreateCommentRequest";
import {getTags} from "../utils/getTags";
import {getCommentByReview} from "../utils/getCommentByReview";
import {createComment} from "../utils/createComment";
import {supabase} from "../supabase/supabase";
import {addReviewMetadata} from "../utils/addReviewMetadata";

class TagsController {
    async getTags(req: any, res: any) {
        try {
            const tags = await getTags()
            return res.status(200).send({message: 'Getting tags successfully', data: tags, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new TagsController()