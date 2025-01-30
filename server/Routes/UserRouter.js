const express = require("express");
const router = express.Router();
const {
  signUp,
  loginUser,
  findUser,
  getAllUsers,
} = require("../controllers/UserController");
const wrapAsync = require("../utils/wrapAsync");
const { isAuthorized } = require("../middleware");

router.route("/finduser/:username").get(isAuthorized, wrapAsync(findUser));
// Route for user signUp
router.post("/register", wrapAsync(signUp));
// Route for user login
router.post("/login", wrapAsync(loginUser));
router.get("/getuser", isAuthorized, wrapAsync(getAllUsers));

module.exports = router;
