import {getUsersByLikes} from "./getUsersByLikes";
import {getUsersByRatings} from "./getUsersByRatings";
import {getTotalLikesByUser} from "./getTotalLikesByUser";
import {fetchImagesByReviewId} from "./fetchImagesByReviewId";

export async function addReviewMetadata(review: any) {
    const likedUserIds = await getUsersByLikes(review.id);
    const ratedUserIds = await getUsersByRatings(review.id);
    const totalAuthorLikes = await getTotalLikesByUser(review.author_id);
    const images = await fetchImagesByReviewId(review.id);
    review.likes = likedUserIds;
    review.ratings = ratedUserIds;
    review.authorLikes = totalAuthorLikes;
    review.images = images;
    return review;
}