const RouterUsers = require('express')
const usersController = require('../controllers/usersController')
const usersRouter = new RouterUsers()

const usersEndPoints = {
    uploadPhoto: '/photo',
    fetchUsers: '/fetch',
}

usersRouter.put(usersEndPoints.uploadPhoto, usersController.uploadProfileInfo)
usersRouter.get(usersEndPoints.fetchUsers, usersController.fetchUsers)

module.exports = usersRouter