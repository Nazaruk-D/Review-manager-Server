"use strict";
const Router = require('express');
const controller = require('./authController');
const router = new Router();
const { check } = require("express-validator");
const endPoints = {
    me: '/me',
    registration: '/register',
    login: '/login',
    logout: '/logout'
};
router.get(endPoints.me, controller.me);
router.post(endPoints.login, [
    check("email", "Email require").notEmpty(),
    check("password", "Password must be less than 1 character").isLength({ min: 1 }),
], controller.login);
router.post(endPoints.registration, [
    check("name", "Username required").notEmpty(),
    check("email", "Email required").notEmpty(),
    check("password", "Password must be less than 1 character").isLength({ min: 1 }),
], controller.registration);
router.delete(endPoints.logout, controller.logout);
module.exports = router;
