import {supabase} from "../supabase/supabase";


export async function updateReview(req: any) {
    let {author_id, reviewId, review_title, body, category, author_name} = req.body;
    const updateObject: any = {
        review_title,
        body,
        category,
        author_id,
        author_name,
    };
    const {data, error} = await supabase
        .from('reviews')
        .update(updateObject)
        .eq('id', reviewId)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Internal server error');
    }
    return data;
}