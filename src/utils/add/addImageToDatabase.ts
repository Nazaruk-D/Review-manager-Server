import {supabase} from "../../supabase/supabase";


export async function addImageToDatabase(urls: string[], reviewId: string) {
    const images = urls.map((url) => ({
        url,
        review_id: reviewId,
    }));
    const { data, error } = await supabase.from("images").insert(images);
    if (error) {
        console.log(error);
    }
    return data;
}