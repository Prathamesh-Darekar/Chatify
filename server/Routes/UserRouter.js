const express = require("express");
const router = express.Router();
const { signUp, loginUser } = require("../controllers/UserController");
const wrapAsync = require("../utils/wrapAsync");

router.post("/register", wrapAsync(signUp));
router.post("/login", wrapAsync(loginUser));

module.exports = router;
