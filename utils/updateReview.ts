import {supabase} from "../supabase";

export async function updateReview(req: any, downloadURL: string = "") {
    let {author_id, reviewId, title, review_title, body, category, assessment, author_name} = req.body;
    const {data, error} = await supabase
        .from('reviews')
        .update({
            title,
            review_title,
            body,
            category,
            assessment,
            author_id,
            author_name,
            image: downloadURL,
        })
        .eq('id', reviewId)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Internal server error');
    }
    return data;
}