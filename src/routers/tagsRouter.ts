import {EndPoints} from "../enum/endPoints";
const Tags = require('express')
const tagsController = require('../controllers/tagsController')
const tagsRouter = new Tags()


tagsRouter.get(EndPoints.getTags, tagsController.getTags)

module.exports = tagsRouter