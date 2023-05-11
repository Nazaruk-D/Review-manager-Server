import {supabase} from "../supabase/supabase";
import {deleteReviewById} from "../utils/deleteReviewById";


class AdminController {
    async fetchUsers(req: any, res: any) {
        try {
            const {data: users, error: reviewError} = await supabase
                .from('users')
                .select('*')
                .order('created_at', {ascending: false});
            return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async changeAdminStatus(req: any, res: any) {
        try {
            const {userId, role} = req.body
            const {error} = await supabase
                .from('users')
                .update({role})
                .match({id: userId});
            if (error) {
                console.error(error);
                return res.status(500).send({message: 'Internal server error'});
            }
            return res.status(200).send({message: 'User role changed', statusCode: 201});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async changeIsBlockedStatus(req: any, res: any) {
        try {
            const {userId, status} = req.body
            const {error} = await supabase
                .from('users')
                .update({is_blocked: status})
                .match({id: userId});
            if (error) {
                console.error(error);
                return res.status(500).send({message: 'Internal server error'});
            }
            return res.status(200).send({message: 'User status changed', statusCode: 201});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async deleteUser(req: any, res: any) {
        try {
            const { userId } = req.params;
            const { data: userReviews, error: userReviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('author_id', userId);
            if (userReviewsError) {
                console.error(userReviewsError);
                return res.status(500).send({ message: userReviewsError.message });
            }
            for (const review of userReviews) {
                await deleteReviewById(review.id);
            }

            const { error: deleteUserError } = await supabase
                .rpc('delete_user_by_id', { id: userId });
            if (deleteUserError) {
                console.error(deleteUserError);
                return res.status(500).send({ message: deleteUserError.message });
            }
            return res.status(200).send({ message: 'User deleted', statusCode: 201 });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Internal server error' });
        }
    }

}

module.exports = new AdminController();
