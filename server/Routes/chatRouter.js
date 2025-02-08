const express = require("express");
const router = express.Router();
const {
  getChatDetails,
  showChats,
  createChat,
  getGroupChatParticipants,
  editChat,
} = require("../controllers/ChatController");
const wrapAsync = require("../utils/wrapAsync");
const { isAuthorized } = require("../middleware");

router.route("/new").post(isAuthorized, wrapAsync(createChat));
router
  .route("/:chat_id/getinfo")
  .get(isAuthorized, wrapAsync(getGroupChatParticipants));
router.route("/:chat_id/edit").put(wrapAsync(editChat));
router
  .route("/:username/:chat_id")
  .get(isAuthorized, wrapAsync(getChatDetails));
router.route("/:username").get(isAuthorized, wrapAsync(showChats));
// router.route("/rename").put(isAuthorized, wrapAsync(renameGroup));
// router.route("/groupadd").put(isAuthorized, wrapAsync(addToGroup));
// router.route("/groupremove").put(isAuthorized, wrapAsync(removeFromeGroup));
// add delete group

module.exports = router;
