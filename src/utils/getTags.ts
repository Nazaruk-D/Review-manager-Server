import {supabase} from "../supabase/supabase";

export async function getTags() {
    const {data: tags, error: reviewsError} = await supabase
        .from('tags')
        .select('name, total_mentions')
    if (reviewsError) {
        console.error(reviewsError);
        return []
    }
    return tags;
}