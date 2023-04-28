import {supabase} from "../supabase";

export async function getLatestReviews() {
    const {data: reviews, error: reviewsError} = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', {ascending: false})
        .limit(3);
    if (reviewsError) {
        console.error(reviewsError);
        throw new Error('Internal server error');
    }
    return reviews;
}