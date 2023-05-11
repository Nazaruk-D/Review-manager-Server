import {deleteTags} from "./deleteTags";
import {deleteRating} from "./deleteRating";
import {deleteComments} from "./deleteComments";
import {deleteLikes} from "./deleteLikes";
import {deleteImagesByReviewId} from "./deleteImagesByReviewId";
import {deleteReviewProductsByReviewId} from "./deleteReviewProductsByReviewId";
import {deleteReview} from "./deleteReview";

export async function deleteReviewById(reviewId: string) {
    try {
        await deleteTags(reviewId)
        await deleteRating(reviewId)
        await deleteComments(reviewId)
        await deleteLikes(reviewId)
        await deleteImagesByReviewId(reviewId)
        await deleteReviewProductsByReviewId(reviewId)
        await deleteReview(reviewId)
    } catch (error) {
        console.error(error);
        throw new Error('Error');
    }
}