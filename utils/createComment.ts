import {supabase} from "../supabase";

export async function createComment(review_id: string, author_id: string, body: string ) {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ review_id, author_id, body }])

    if (error) {
        console.log(error);
        return null;
    }

    return data
}

