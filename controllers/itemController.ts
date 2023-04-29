import {CreateCommentRequest} from "../types/CreateCommentRequest";
import {getTags} from "../utils/getTags";
import {getCommentByReview} from "../utils/getCommentByReview";
import {createComment} from "../utils/createComment";

class ItemController {
    async getTags(req: any, res: any) {
        try {
            const tags = await getTags()
            return res.status(200).send({message: 'Getting tags successfully', data: tags, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async getComments(req: any, res: any) {
        const reviewId = req.params.reviewId;
        try {
            const comments = await getCommentByReview(reviewId)
            return res.status(200).send({message: 'Getting comments successfully', data: comments, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async createComment(req: { body: CreateCommentRequest }, res: any) {
        const {author_id, review_id, body} = req.body
        try {
            const data = await createComment(review_id, author_id, body)
            return res.status(201).send({message: 'Comment created successfully', data, statusCode: 201});
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ItemController()