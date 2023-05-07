import { supabase } from "../supabase/supabase";

export async function deleteImagesByReviewId(reviewId: string) {
    const { error } = await supabase.from("images").delete().eq("review_id", reviewId);

    if (error) {
        console.error(error);
        throw error;
    }

    console.log(`Images for review ${reviewId} have been deleted`);
}
