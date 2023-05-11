import {supabase} from "../../supabase/supabase";

export async function fetchLatestReviews() {
    const {data: reviews, error: reviewsError} = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', {ascending: false})
        .limit(4);
    if (reviewsError) {
        console.error(reviewsError);
        throw new Error('Internal server error');
    }
    return reviews;
}