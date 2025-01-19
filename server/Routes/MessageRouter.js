const express = require("express");
const router = express.Router();
const { createMessage } = require("../controllers/MessageController");
const wrapAsync = require("../utils/wrapAsync");
const { isAuthorized } = require("../middleware");

router.route("/new").post(isAuthorized, wrapAsync(createMessage));

module.exports = router;
