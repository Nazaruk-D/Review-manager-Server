import {supabase} from "../supabase/supabase";

export async function deleteReview(reviewId: number) {
    const {data, error: deleteReviewError} = await supabase
        .from('reviews')
        .delete()
        .match({id: reviewId});

    if (deleteReviewError) {
        throw new Error('Error deleting likes: ' + deleteReviewError.message);
    }

}
