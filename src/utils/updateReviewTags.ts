import {addTags} from "./addTags";
import {deleteTags} from "./deleteTags";

export async function updateReviewTags(tags: string[] | string, reviewId: string) {
    await deleteTags(reviewId)
    if (tags && tags.length > 0) {
        await addTags(tags, reviewId)
    }
}