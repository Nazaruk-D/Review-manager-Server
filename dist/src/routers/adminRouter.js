"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Admin = require('express');
const adminController = require('../controllers/itemController');
const adminRouter = new Admin();
module.exports = adminRouter;
