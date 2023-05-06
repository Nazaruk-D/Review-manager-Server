import {supabase} from "../supabase/supabase";


class AdminController {
    async fetchUsers(req: any, res: any) {
        try {
            const {data: users, error: reviewError} = await supabase
                .from('users')
                .select('*')
            return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }

    async changeAdminStatus (req: any, res: any) {
        try {
            const {userId, role} = req.body
            const { error } = await supabase
                .from('users')
                .update({ role })
                .match({ id: userId });
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

    async changeIsBlockedStatus (req: any, res: any) {
        try {
            const {userId, status} = req.body
            const { error } = await supabase
                .from('users')
                .update({ is_blocked: status })
                .match({ id: userId });
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
}

module.exports = new AdminController();
