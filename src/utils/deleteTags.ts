import {supabase} from "../supabase/supabase";

export async function deleteTags(reviewId: string) {
    const { data: deletedReviewTags, error } = await supabase
        .from("review_tags")
        .delete()
        .match({ review_id: reviewId })
        .select("tag_id");

    if (error) {
        console.error(error);
        throw new Error("Internal server error");
    }

    if (deletedReviewTags && deletedReviewTags.length > 0) {
        const tagIds = deletedReviewTags.map((rt) => rt.tag_id);
        const { data: remainingReviewTags, error } = await supabase
            .from("review_tags")
            .select("tag_id")
            .in("tag_id", tagIds);

        if (error) {
            console.error(error);
            throw new Error("Internal server error");
        }

        const remainingTagIds = remainingReviewTags.map((rt) => rt.tag_id);
        const deletedTagIds = tagIds.filter((id) => !remainingTagIds.includes(id));

        if (deletedTagIds.length > 0) {
            const { error } = await supabase
                .from("tags")
                .delete()
                .in("id", deletedTagIds);

            if (error) {
                console.error(error);
                throw new Error("Internal server error");
            }
        }
    }
}
