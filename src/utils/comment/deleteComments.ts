import {supabase} from "../../supabase/supabase";

export async function deleteComments(reviewId: string) {
    const {data: commentsToDelete, error: commentsError} = await supabase
        .from('comments')
        .select('*')
        .eq('review_id', reviewId);
    if (commentsError) {
        throw new Error('Error deleting comments');
    }
    if (commentsToDelete && commentsToDelete.length > 0) {
        const {error: deleteCommentsError} = await supabase
            .from('comments')
            .delete()
            .eq('review_id', reviewId);
        if (deleteCommentsError) {
            throw new Error('Error deleting comments');
        }
    }
}
