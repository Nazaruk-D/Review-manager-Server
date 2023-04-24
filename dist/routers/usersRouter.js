"use strict";
const RouterUsers = require('express');
const usersController = require('../controllers/usersController');
const usersRouter = new RouterUsers();
const usersEndPoints = {
    uploadProfileInfo: '/upload-info',
    getUsers: '/get-users',
    getUser: '/get-user/:userId',
};
usersRouter.put(usersEndPoints.uploadProfileInfo, usersController.uploadProfileInfo);
usersRouter.get(usersEndPoints.getUsers, usersController.fetchUsers);
usersRouter.get(usersEndPoints.getUser, usersController.fetchUser);
module.exports = usersRouter;
