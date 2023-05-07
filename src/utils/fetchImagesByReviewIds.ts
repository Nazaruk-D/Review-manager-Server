import { supabase } from "../supabase/supabase";

export async function fetchImagesByReviewIds(reviewIds: string[]) {
    const { data: images, error: imagesError } = await supabase
        .from('images')
        .select('url, review_id')
        .in('review_id', reviewIds);

    if (imagesError) {
        console.error(imagesError);
        return;
    }

    return images || [];
}
