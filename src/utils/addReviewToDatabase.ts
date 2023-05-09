import {supabase} from "../supabase/supabase";

export async function addReviewToDatabase(req: any) {
    let {author_id, review_title, body, category, author_name} = req.body;
    const { data, error } = await supabase
        .from("reviews")
        .insert({
            review_title,
            body,
            category,
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