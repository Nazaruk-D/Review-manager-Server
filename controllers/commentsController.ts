import {CreateCommentRequest} from "../types/CreateCommentRequest";
import {supabase} from "../supabase";

class CommentsController {
    async getComments(req: any, res: any) {
        const reviewId = req.params.reviewId;
        try {
            const { data: comments, error } = await supabase
                .from('comments')
                .select('*, users!inner(*)')
                .eq('review_id', reviewId)
                .order('created_at', { ascending: true })

            if (error) {
                console.log(error);
                return null;
            }

            return res.status(200).send({message: 'Getting comments successfully', data: comments, statusCode: 200});
        } catch (e) {
            console.log(e)
        }
    }

    async createComment(req: { body: CreateCommentRequest }, res: any) {
        const {author_id, review_id, body} = req.body
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([{ review_id, author_id, body }])

            if (error) {
                console.log(error);
                return null;
            }

            return res.status(201).send({message: 'Comment created successfully', data: req.body, statusCode: 201});
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new CommentsController()