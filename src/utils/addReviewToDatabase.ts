import {supabase} from "../supabase/supabase";

export async function addReviewToDatabase(req: any, author_name: string) {
    let {author_id, review_title, body, category} = req.body;
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