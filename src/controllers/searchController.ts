import {supabase} from "../supabase/supabase";
import {addReviewMetadata} from "../utils/add/addReviewMetadata";
import { Request, Response } from "express";

class SearchController {
    async getReviews(req: Request, res: Response) {
        try {
            const value = req.params.value;
            const {data: reviews, error: reviewError} = await supabase
                .rpc('search_reviews_tags_comments', {query_text: value});
            const reviewsWithMetadata = await Promise.all(reviews.map(addReviewMetadata));
            if (reviewError) {
                console.log(reviewError)
                return
            }
            return res.status(200).send({
                message: 'Found reviews on request received successfully',
                data: reviewsWithMetadata,
                statusCode: 200
            });
        } catch (e) {
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new SearchController()