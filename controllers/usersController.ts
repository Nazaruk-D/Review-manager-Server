import {connection} from "../index";

class usersController {
    async fetchUsers(req: any, res: any) {
        try {
            return res.status(200).send({message: 'Getting users successfully', data: {}, statusCode: 200});
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new usersController()