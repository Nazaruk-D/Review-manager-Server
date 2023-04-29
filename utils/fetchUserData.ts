import {supabase} from "../supabase";
import {getTotalLikesByUser} from "./getTotalLikesByUser";

export async function fetchUserData(userId: string) {
    try {
        const { data: user, error: reviewError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const totalLikes = await getTotalLikesByUser(userId);
        if (user && totalLikes) {
            user.totalLikes = totalLikes;
        }
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user data');
    }
}