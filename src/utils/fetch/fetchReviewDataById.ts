import {fetchImagesByReviewId} from "./fetchImagesByReviewId";
import {fetchProductsDataByReviewId} from "./fetchProductsDataByReviewId";
import {fetchReviewById} from "./fetchReviewById";
import {fetchUsersByLikes} from "./fetchUsersByLikes";

export async function fetchReviewDataById(reviewId: string) {
    const review = await fetchReviewById(reviewId)
    const likes = await fetchUsersByLikes(review.id)
    const images = await fetchImagesByReviewId(review.id);
    const {title, assessment} = await fetchProductsDataByReviewId(review.id)

    return {
        ...review,
        likes: likes?.map(like => like.user_id) || [],
        images,
        title,
        assessment

    };
}

