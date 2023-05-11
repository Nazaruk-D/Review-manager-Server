import {supabase} from "../../supabase/supabase";

export async function updateUserName(newName: string, userId: string) {
    const {data, error} = await supabase
        .from('users')
        .update({user_name: newName})
        .match({id: userId});

    if (error) {
        console.log(error);
        return
    }
}