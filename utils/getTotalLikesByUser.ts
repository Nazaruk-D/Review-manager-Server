import {supabase} from "../supabase/supabase";

export async function getTotalLikesByUser(userId: string): Promise<number> {
    const { data: totalLikes, error } = await supabase.rpc('count_likes_by_user', { p_user_id: userId });
    if (error) {
        console.error(error);
        return 0;
    }

    return totalLikes || 0;
}

