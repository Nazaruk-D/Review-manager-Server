import {supabase} from "../supabase";

export async function addTags(tags: string[] | string, newReviewId: any) {
    if (typeof tags === 'string') {
        tags = tags.split(',');
    }
    if (tags && tags.length > 0) {
        try {
            const tagIds = await Promise.all(tags.map(async (tag: string) => {
                const {data, error} = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', tag)
                    .maybeSingle();

                if(error) {
                    throw error;
                }

                if (!data) {
                    const {data, error: tagError} = await supabase
                        .from('tags')
                        .insert({name: tag})
                        .select('id')
                        .maybeSingle();
                    if (tagError) throw tagError;
                    return data?.id;
                }
                return data.id;
            }));

            const reviewTagInserts = tagIds.map((tagId) => {
                return {review_id: newReviewId, tag_id: tagId};
            });

            const {error: reviewTagError} = await supabase
                .from('review_tags')
                .insert(reviewTagInserts)

            if (reviewTagError) throw reviewTagError;
        } catch (error) {
            console.log(error);
        }
    }
}
