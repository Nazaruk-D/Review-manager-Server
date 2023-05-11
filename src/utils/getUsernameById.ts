import {supabase} from "../supabase/supabase";


export async function getUsernameById(userId: string): Promise<string> {
    const { data, error } = await supabase.from('users').select('user_name').eq('id', userId).single();
    if (error) {
        console.error(error);
        return "";
    }
    return data?.user_name;
}
