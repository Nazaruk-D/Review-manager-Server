"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endPoints_1 = require("../enum/endPoints");
const Tags = require('express');
const tagsController = require('../controllers/tagsController');
const tagsRouter = new Tags();
tagsRouter.get(endPoints_1.EndPoints.getTags, tagsController.getTags);
module.exports = tagsRouter;
