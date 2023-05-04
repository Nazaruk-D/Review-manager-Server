const Item = require('express')
const itemController = require('../controllers/itemController')
const itemRouter = new Item()

const itemEndPoints = {
    getTags: '/tags',
    getComments: '/comment/:reviewId',
    search: '/search/:value',
}

itemRouter.get(itemEndPoints.getComments, itemController.getComments)
itemRouter.get(itemEndPoints.getTags, itemController.getTags)
itemRouter.get(itemEndPoints.search, itemController.getReviews)

module.exports = itemRouter