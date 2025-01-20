const express = require("express");
const router = express.Router();
const {
  createMessage,
  deleteMessage,
} = require("../controllers/MessageController");
const wrapAsync = require("../utils/wrapAsync");
const { isAuthorized } = require("../middleware");

router.route("/new").post(isAuthorized, wrapAsync(createMessage));
router.route("/delete").delete(isAuthorized, wrapAsync(deleteMessage));

module.exports = router;
