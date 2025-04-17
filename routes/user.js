const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


// Router.route function 
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync( userController.signUp))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.login)


// router.get("/signup", userController.renderSignupForm);


//Signup route
// router.post("/signup", wrapAsync( userController.signUp));

// router.get("/login", userController.renderLoginForm)

// router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.login)

router.get("/logout", userController.logout)

module.exports = router;