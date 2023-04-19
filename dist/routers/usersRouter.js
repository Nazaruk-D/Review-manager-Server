"use strict";
const RouterUsers = require('express');
const usersController = require('../controllers/usersController');
const usersRouter = new RouterUsers();
const usersEndPoints = {
    fetchUsers: '/fetch',
};
usersRouter.get(usersEndPoints.fetchUsers, usersController.fetchUsers);
module.exports = usersRouter;
