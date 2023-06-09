import {supabase} from "../../supabase/supabase";

export async function updateUserPhoto(downloadURL: string, userId: string) {
    const {data, error} = await supabase
        .from('users')
        .update({main_photo: downloadURL, small_photo: downloadURL})
        .match({id: userId})
        .single()
    if (error) {
        console.log(error);
        return
    }
}