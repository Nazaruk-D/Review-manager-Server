"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerSocial = (0, express_1.Router)();
const passport = require("passport");
const CLIENT_URL = "http://localhost:3000/";
const endPoints = {
    login: '/login',
    logout: '/logout',
};
routerSocial.post(endPoints.login, (req, res) => {
    console.log("REQQQQQQQQQQQQQQQQQ: ", req.body);
    res.status(200).json({ code: 200, message: "eeeee", data: req.body });
});
//routerSocial.get("/login/failed", (req: any,res: any) => {
//    res.status(401).json({code: 401, message: "failure"})
//})
//
//routerSocial.get("/login/success", (req: any,res: any) => {
//    if(req.user) {
//        res.status(200).json({code: 200, message: "success", data: req.user, cookies: req.cookies})
//    }
//})
routerSocial.get("/logout", (req, res) => {
    req.logout();
    //res.redirect(CLIENT_URL)
});
//routerSocial.get("/google", passport.authenticate("google", {scope:["profile"]}))
//routerSocial.get("/google/callback", passport.authenticate("google", {
//    successRedirect: CLIENT_URL,
//    failureRedirect: "/login/failed"
//}))
routerSocial.post('/facebook', passport.authenticate('facebook'));
routerSocial.post('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});
exports.default = routerSocial;
