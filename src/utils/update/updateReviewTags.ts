import {addTags} from "../add/addTags";
import {deleteTags} from "../delete/deleteTags";

export async function updateReviewTags(tags: string[] | string, reviewId: string) {
    await deleteTags(reviewId)
    if (tags && tags.length > 0) {
        await addTags(tags, reviewId)
    }
}