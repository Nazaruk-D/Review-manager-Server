"use strict";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const FACEBOOK_CLIENT_ID = "948110579538708";
const FACEBOOK_CLIENT_SECRET = "7772c690d53652ad74ac2069c04db5bf";
passport.use(new GoogleStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, function (accessToken, refreshToken, profile, cb) {
    //User.findOrCreate({googleId: profile.id}, function (err: any, user: any) {
    //    return cb(err, user);
    //});
    const user = {
        username: profile.displayName,
        avatar: profile.photos[0]
    };
}));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
