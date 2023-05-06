import {EndPoints} from "../enum/endPoints";
const AdminRouter = require('express')
const adminController = require('../controllers/adminController')
const adminRouter = new AdminRouter()


adminRouter.get(EndPoints.getUsers, adminController.fetchUsers)
adminRouter.put(EndPoints.changeAdminStatus, adminController.changeAdminStatus)
adminRouter.put(EndPoints.changeIsBlockedStatus, adminController.changeIsBlockedStatus)
adminRouter.delete(EndPoints.deleteUser, adminController.deleteUser)

module.exports = adminRouter