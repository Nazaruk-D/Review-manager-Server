import {supabase} from "../../supabase/supabase";
import {Review} from "../../types/ReviewType";

export async function fetchReviewById(reviewId: string): Promise<Review> {
    const {data: review, error: reviewError} = await supabase
        .from('reviews')
        .select('id, author_id, body, author_name, review_title, category, avg_rating, created_at')
        .eq('id', reviewId)
        .single();
    if (reviewError) {
        console.error(reviewError);
        throw new Error('Internal server error');
    }
    return review;
}

