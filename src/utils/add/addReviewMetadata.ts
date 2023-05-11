import {fetchImagesByReviewId} from "../fetch/fetchImagesByReviewId";
import {fetchProductsDataByReviewId} from "../fetch/fetchProductsDataByReviewId";
import {fetchUsersByLikes} from "../fetch/fetchUsersByLikes";
import {fetchUsersByRatings} from "../fetch/fetchUsersByRatings";
import {fetchTotalLikesByUser} from "../fetch/fetchTotalLikesByUser";

export async function addReviewMetadata(review: any) {
    const likedUserIds = await fetchUsersByLikes(review.id);
    const ratedUserIds = await fetchUsersByRatings(review.id);
    const totalAuthorLikes = await fetchTotalLikesByUser(review.author_id);
    const images = await fetchImagesByReviewId(review.id);
    const {title, assessment, avg_assessment} = await fetchProductsDataByReviewId(review.id)
    review.avg_assessment = avg_assessment
    review.title = title;
    review.assessment = assessment;
    review.likes = likedUserIds;
    review.ratings = ratedUserIds;
    review.authorLikes = totalAuthorLikes;
    review.images = images;
    return review;
}