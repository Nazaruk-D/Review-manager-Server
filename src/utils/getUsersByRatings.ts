import {supabase} from "../supabase/supabase";

export async function getUsersByRatings(reviewId: string) {
    const { data: ratings, error } = await supabase
        .from('ratings')
        .select('user_id')
        .eq('review_id', reviewId);
    if (error) {
        console.error(error);
        return [];
    }
    const ratingUsers = ratings.map((rating) => rating.user_id);
    return ratingUsers;
}