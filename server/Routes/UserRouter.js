const express = require("express");
const router = express.Router();
const { signUp, loginUser } = require("../controllers/UserController");

router.post("/register", signUp);
router.post("/login", loginUser);

module.exports = router;
