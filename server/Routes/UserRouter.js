const express = require("express");
const router = express.Router();
const {
  signUp,
  loginUser,
  getAllUsers,
} = require("../controllers/UserController");
const wrapAsync = require("../utils/wrapAsync");

// Route for user signUp
router.post("/register", wrapAsync(signUp));
// Route for user login
router.post("/login", wrapAsync(loginUser));
// Route to check data
router.get("/getdata", wrapAsync(getAllUsers));

module.exports = router;
