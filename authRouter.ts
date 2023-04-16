const Router = require('express')
const controller = require('./authController')
const router = new Router()
const {check} = require("express-validator")

const endPoints = {
    auth: '/',
    registration: '/register',
    login: '/login',
    logout: '/logout'
}

//router.get(endPoints.auth, controller.auth)
router.post(endPoints.login, [
    check("email", "Email require").notEmpty(),
    check("password", "Password must be less than 6 character").isLength({min: 6}),
], controller.login)
router.post(endPoints.registration, [
  check("userName", "First name required").notEmpty(),
  check("email", "Email required").notEmpty(),
  check("password", "Password must be less than 6 character").isLength({min: 6}),
], controller.registration)
router.delete(endPoints.logout, controller.logout)


module.exports = router