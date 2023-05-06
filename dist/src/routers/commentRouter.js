"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endPoints_1 = require("../enum/endPoints");
const Comment = require('express');
const commentController = require('../controllers/commentsController');
const commentRouter = new Comment();
commentRouter.get(endPoints_1.EndPoints.getComments, commentController.getComments);
commentRouter.delete(endPoints_1.EndPoints.deleteComments, commentController.deleteComments);
module.exports = commentRouter;
