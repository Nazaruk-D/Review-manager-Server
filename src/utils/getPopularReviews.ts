import {supabase} from "../supabase/supabase";

export async function getPopularReviews() {
    const {data: reviews, error: reviewsError} = await supabase
        .from('reviews')
        .select('*')
        .order('avg_rating', { ascending: false })
        .limit(4)
    if (reviewsError) {
        console.error(reviewsError);
        throw new Error('Internal server error');
    }
    return reviews;
}