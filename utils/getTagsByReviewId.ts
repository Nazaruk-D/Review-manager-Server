import {supabase} from "../supabase/supabase";

export async function getTagsByReviewId(reviewId: string) {
    const { data: tags, error: tagsError } = await supabase
        .from('review_tags')
        .select('tag_id')
        .eq('review_id', reviewId);
    if (tagsError) {
        console.error(tagsError);
        throw new Error('Internal server error');
    }
    const tagIds = tags.map((tag) => tag.tag_id);
    const { data: tagData, error: tagDataError } = await supabase
        .from('tags')
        .select('name')
        .in('id', tagIds);
    if (tagDataError) {
        console.error(tagDataError);
        throw new Error('Internal server error');
    }
    const tagNames = tagData.map((tag) => tag.name);
    return tagNames;
}