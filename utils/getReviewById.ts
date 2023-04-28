import {supabase} from "../supabase";

export async function getReviewById(reviewId: string) {
    const {data: review, error: reviewError} = await supabase
        .from('reviews')
        .select('*')
        .eq('id', reviewId)
        .single();
    if (reviewError) {
        console.error(reviewError);
        throw new Error('Internal server error');
    }
    return review;
}