import {supabase} from "../supabase";

export async function addReviewToDatabase(req: any, downloadURL: any) {
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
            image: downloadURL,
        })
        .select("id")
        .single();
    if (error) {
        console.log(error);
    }
    return data!.id;
}