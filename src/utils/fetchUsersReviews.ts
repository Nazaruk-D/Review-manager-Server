import {supabase} from "../supabase/supabase";

export async function fetchUsersReviews(userId: string) {
    const {data: reviews, error: reviewError} = await supabase
        .from('reviews')
        .select('*')
        .eq('author_id', userId);
    if (reviewError) {
        console.error(reviewError);
        return;
    }
    return reviews || [];
}

