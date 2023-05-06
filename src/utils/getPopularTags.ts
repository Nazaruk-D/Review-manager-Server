import {supabase} from "../supabase/supabase";

export async function getPopularTags() {
    const {data: tags, error: reviewsError} = await supabase
        .from('tags')
        .select('name, review_tags!inner(tag_id)')
    if (reviewsError) {
        console.error(reviewsError);
        return []
    }
    const sortData = tags.sort((a: PopularTag, b: PopularTag) => {
        const aLength = Array.isArray(a.review_tags) ? a.review_tags.length : 0;
        const bLength = Array.isArray(b.review_tags) ? b.review_tags.length : 0;
        return bLength - aLength;
    });
    const popularTags = sortData.slice(0, 15).map(t => t.name)
    return popularTags;
}

interface PopularTag {
    name: string;
    review_tags: ({ tag_id: any } | { tag_id: any }[]) | null;
}