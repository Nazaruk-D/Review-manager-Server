import {supabase} from "../supabase";

export async function fetchUserData(userId: string) {
    try {
        const { data: user, error: reviewError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user data');
    }
}