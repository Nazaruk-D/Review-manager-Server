import {supabase} from "../supabase/supabase";

export async function addReviewToDatabase(req: any) {
    let {author_id, title, review_title, body, category, assessment, tags, author_name} = req.body;
    const { data, error } = await supabase
        .from("reviews")
        .insert({
            title,
            review_title,
            body,
            category,
            assessment,
            author_id,
            author_name,
        })
        .select("id")
        .single();
    if (error) {
        console.log(error);
    }
    return data!.id;
}