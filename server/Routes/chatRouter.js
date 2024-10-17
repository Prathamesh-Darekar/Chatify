const express = require("express");
const router = express.Router();
const { accessChat } = require("../controllers/ChatController");
const wrapAsync = require("../utils/wrapAsync");
const { isAuthorized } = require("../middleware");

router.route("/").post(isAuthorized, wrapAsync(accessChat));
// router.route("/").get(isAuthorized, wrapAsync(fetchChats));
// router.route("/group").post(isAuthorized, wrapAsync(createGroupChat));
// router.route("/rename").put(isAuthorized, wrapAsync(renameGroup));
// router.route("/groupadd").put(isAuthorized, wrapAsync(addToGroup));
// router.route("/groupremove").put(isAuthorized, wrapAsync(removeFromeGroup));
// add delete group

module.exports = router;
