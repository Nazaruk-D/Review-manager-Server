import {supabase} from "../supabase";

export async function getExistingRating(userId: string, reviewId: string) {
    const {data: existingRating, error: reviewError} = await supabase
        .from('ratings')
        .select('id, value')
        .eq('review_id', reviewId)
        .eq('user_id', userId)
        .single();

    return existingRating;
}