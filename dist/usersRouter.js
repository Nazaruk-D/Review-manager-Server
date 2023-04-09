"use strict";
const RouterUsers = require('express');
const usersController = require('./usersController');
const usersRouter = new RouterUsers();
const usersEndPoints = {
    fetchUsers: '/fetch',
    blockingUsers: '/status',
    deleteUsers: '/delete',
};
usersRouter.get(usersEndPoints.fetchUsers, usersController.fetchUsers);
usersRouter.put(usersEndPoints.blockingUsers, usersController.changeStatusUsers);
usersRouter.delete(usersEndPoints.deleteUsers, usersController.deleteUsers);
module.exports = usersRouter;
