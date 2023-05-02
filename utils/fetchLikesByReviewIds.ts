import {supabase} from "../supabase/supabase";

export async function fetchLikesByReviewIds(reviewIds: string[]) {
    const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .in('review_id', reviewIds);

    if (likesError) {
        console.error(likesError);
        return
    }

    return likes || [];
}

