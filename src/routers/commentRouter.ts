import {EndPoints} from "../enum/endPoints";
const Comment = require('express')
const commentController = require('../controllers/commentsController')
const commentRouter = new Comment()


commentRouter.get(EndPoints.getComments, commentController.getComments)
commentRouter.delete(EndPoints.deleteComments, commentController.deleteComments)

module.exports = commentRouter