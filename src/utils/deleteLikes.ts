import {supabase} from "../supabase/supabase";

export async function deleteLikes(reviewId: string) {
    const { data: likesToDelete, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .eq('review_id', reviewId);

    if (likesError) {
        throw new Error('Error deleting likes: ' + likesError.message);
    }

    if (likesToDelete && likesToDelete.length > 0) {
        const { error: deleteLikesError } = await supabase
            .from('likes')
            .delete()
            .eq('review_id', reviewId);

        if (deleteLikesError) {
            throw new Error('Error deleting likes: ' + deleteLikesError.message);
        }
    }
}
