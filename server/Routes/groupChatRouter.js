const express = require("express");
const { isAuthorized } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { createGroupChat } = require("../controllers/GroupChatController");
const router = express.Router();

router.route("/new").post(isAuthorized, wrapAsync(createGroupChat));

module.exports = router;
