import {supabase} from "../supabase";

export async function getTags() {
    const {data: tags, error} = await supabase
        .from('tags')
        .select('name')

    if (error) {
        console.error(error);
        return []
    }

    return tags.map( tag => tag.name);
}

