import {getReviewById} from "./getReviewById";
import {getUsersByLikes} from "./getUsersByLikes";
import {fetchImagesByReviewId} from "./fetchImagesByReviewId";
import {fetchProductsDataByReviewId} from "./fetchProductsDataByReviewId";

export async function fetchReviewDataById(reviewId: string) {
    const review = await getReviewById(reviewId)
    const likes = await getUsersByLikes(review.id)
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

