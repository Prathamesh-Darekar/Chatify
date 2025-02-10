const express = require("express");
const router = express.Router();
const {
  signUp,
  loginUser,
  findUser,
  getAllUsers,
  editUser,
} = require("../controllers/UserController");
const wrapAsync = require("../utils/wrapAsync");
const { isAuthorized } = require("../middleware");

router.route("/:id/edit").put(isAuthorized, wrapAsync(editUser));
router.route("/:id/finduser/:username").get(isAuthorized, wrapAsync(findUser));
router.post("/register", wrapAsync(signUp));
router.post("/login", wrapAsync(loginUser));
router.get("/getuser", isAuthorized, wrapAsync(getAllUsers));

module.exports = router;
