import {getCommentByReview} from "../utils/getCommentByReview";

class CommentsController {
      async getComments(req: any, res: any) {
        try {
            const reviewId = req.params.reviewId;
            const comments = await getCommentByReview(reviewId)
            return res.status(200).send({message: 'Getting comments successfully', data: comments, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async deleteComments(req: any, res: any) {
        try {
            const commentId = req.params.commentId;
            console.log(commentId)
            return res.status(200).send({message: 'Remove comments successfully', statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new CommentsController()