"use strict";
const CommentsUsers = require('express');
const commentsController = require('../controllers/commentsController');
const commentsRouter = new CommentsUsers();
const commentsEndPoints = {
    comment: '/',
    getComments: '/:reviewId',
};
commentsRouter.get(commentsEndPoints.getComments, commentsController.getComments);
commentsRouter.post(commentsEndPoints.comment, commentsController.createComment);
module.exports = commentsRouter;
