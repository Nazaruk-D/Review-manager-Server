import {supabase} from "../supabase/supabase";

export async function getPopularReviews() {
    const {data: reviews, error: reviewsError} = await supabase
        .from('reviews')
        .select('*')
    if (reviewsError) {
        console.error(reviewsError);
        throw new Error('Internal server error');
    }
    const sortReviews = reviews.sort((a, b) => b.avgRating - a.avgRating).slice(0, 4);

    return sortReviews;
}