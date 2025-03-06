const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require('../models/users.js');
const wrapAsync = require('../wrapAsync/wrapAsync.js');
const controllers = require("../controllers/user.js");
const {saveRedirectUrl} = require('../middleware.js');

//signUp route to get form and signUp route to get sign up
router.route("/signUp")
.get(wrapAsync(controllers.signUpForm))
.post(wrapAsync(controllers.signUp));

//login route to get form and login route to get logged in 
router.route("/login")
.get( wrapAsync(controllers.loginForm))
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login",failureFlash: true,}),wrapAsync(controllers.logginPost));

//logout route 
router.get("/logout", wrapAsync(controllers.logout));

module.exports = router;