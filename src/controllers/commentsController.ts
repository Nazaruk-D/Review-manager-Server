import {getCommentByReview} from "../utils/comment/getCommentByReview";
import {supabase} from "../supabase/supabase";
import { Request, Response } from "express";

class CommentsController {
      async getComments(req: Request, res: Response) {
        try {
            const reviewId = req.params.reviewId;
            const comments = await getCommentByReview(reviewId)
            return res.status(200).send({message: 'Getting comments successfully', data: comments, statusCode: 200});
        } catch (error) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async deleteComments(req: Request, res: Response) {
        try {
            const commentId = req.params.commentId;
            const {error: reviewError} = await supabase
                .from('comments')
                .delete()
                .match({id: commentId});
            return res.status(200).send({message: 'Remove comments successfully', statusCode: 200});
        } catch (error) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new CommentsController()