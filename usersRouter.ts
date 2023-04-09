const RouterUsers = require('express')
const usersController = require('./usersController')
const usersRouter = new RouterUsers()

const usersEndPoints = {
    fetchUsers: '/fetch',
}

usersRouter.get(usersEndPoints.fetchUsers, usersController.fetchUsers)

module.exports = usersRouter