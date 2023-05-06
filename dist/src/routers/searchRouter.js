"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endPoints_1 = require("../enum/endPoints");
const Search = require('express');
const searchController = require('../controllers/searchController');
const searchRouter = new Search();
searchRouter.get(endPoints_1.EndPoints.search, searchController.getReviews);
module.exports = searchRouter;
