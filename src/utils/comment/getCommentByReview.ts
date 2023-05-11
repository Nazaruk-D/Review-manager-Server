import {supabase} from "../../supabase/supabase";

export async function getCommentByReview(reviewId: string) {
    const { data: comments, error } = await supabase
        .from('comments')
        .select('*, users!inner(*)')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })

    if (error) {
        console.log(error);
        return null;
    }

    return comments
}

