import {EndPoints} from "../enum/endPoints";
const RouterUsers = require('express')
const usersController = require('../controllers/usersController')
const usersRouter = new RouterUsers()


usersRouter.put(EndPoints.uploadProfileInfo, usersController.uploadProfileInfo)
usersRouter.get(EndPoints.getUsers, usersController.fetchUsers)
usersRouter.get(EndPoints.getUser, usersController.fetchUser)

module.exports = usersRouter