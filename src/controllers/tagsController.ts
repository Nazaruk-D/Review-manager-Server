import { Request, Response } from "express";
import {fetchTags} from "../utils/fetch/fetchTags";


class TagsController {
    async getTags(req: Request, res: Response) {
        try {
            const tags = await fetchTags()
            return res.status(200).send({message: 'Getting tags successfully', data: tags, statusCode: 200});
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: 'Internal server error'});
        }
    }
}

module.exports = new TagsController()