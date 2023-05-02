import {supabase} from "../supabase/supabase";

export async function getUsersByLikes(reviewId: string) {
    const { data: likes, error } = await supabase
        .from('likes')
        .select('user_id')
        .eq('review_id', reviewId);
    if (error) {
        console.error(error);
        return [];
    }
    const likeUsers = likes.map((like) => like.user_id);
    return likeUsers;
}