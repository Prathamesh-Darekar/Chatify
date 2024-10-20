const express = require("express");
const router = express.Router();
const { signUp, loginUser } = require("../controllers/UserController");
const wrapAsync = require("../utils/wrapAsync");

// Route for user signUp
router.post("/register", wrapAsync(signUp));
// Route for user login
router.post("/login", wrapAsync(loginUser));

module.exports = router;
