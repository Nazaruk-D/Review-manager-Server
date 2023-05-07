import { supabase } from "../supabase/supabase";

export async function fetchImagesByReviewId(reviewId: string) {
    const {data: images, error} = await supabase
        .from('images')
        .select('url')
        .eq('review_id', reviewId);
    if (error) {
        console.error(error);
        return [];
    }
    return images?.map(image => image.url) || [];
}