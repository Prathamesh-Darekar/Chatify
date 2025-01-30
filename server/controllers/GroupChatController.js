const Chat = require("../models/Chat");
const User = require("../models/User");

const createGroupChat = async (req, res) => {
  const { groupName, participants, groupLogo } = req.body;
  if (!groupName || !participants) return res.status(409).json("bad request");
  const newgroupChat = new Chat({
    chatName: groupName,
    isGroupChat: true,
    users: participants,
    groupAdmin: req.user._id,
    latestMessage: null,
  });
  let result = await newgroupChat.save();
  if (result) {
    participants.forEach(async (userId) => {
      await User.findByIdAndUpdate(userId, {
        $push: { chats: newgroupChat._id },
      });
    });
  }
  return res.status(200).json("success");
};

module.exports = { createGroupChat };
