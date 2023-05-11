import {supabase} from "../../supabase/supabase";

export async function deleteRating(reviewId: string) {
    const { data: ratingsToDelete, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("review_id", reviewId);

    if (error) {
        console.error(error);
        throw new Error("Internal server error");
    }

    if (ratingsToDelete && ratingsToDelete.length > 0) {
        const { error } = await supabase
            .from("ratings")
            .delete()
            .eq("review_id", reviewId);

        if (error) {
            console.error(error);
            throw new Error("Internal server error");
        }
    }
}

