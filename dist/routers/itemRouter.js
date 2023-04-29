"use strict";
const Item = require('express');
const itemController = require('../controllers/itemController');
const itemRouter = new Item();
const itemEndPoints = {
    comment: '/comment',
    getTags: '/tags',
    getComments: '/comment/:reviewId',
};
itemRouter.get(itemEndPoints.getComments, itemController.getComments);
itemRouter.get(itemEndPoints.getTags, itemController.getTags);
itemRouter.post(itemEndPoints.comment, itemController.createComment);
module.exports = itemRouter;
