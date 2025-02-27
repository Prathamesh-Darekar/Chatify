const Chat = require("../models/Chat");
const User = require("../models/User");

// API to create a new group
const createGroupChat = async (req, res) => {
  let { groupName, participants, groupLogo } = req.body;
  if (!groupName || !participants)
    return res
      .status(409)
      .json({ message: "Please provide all the group details" });
  participants = participants.map((user) => {
    return user._id;
  });
  participants.push(req.user._id);
  const newgroupChat = new Chat({
    chatName: groupName,
    isGroupChat: true,
    users: participants,
    groupAdmin: req.user._id,
    latestMessage: null,
  });
  if (groupLogo) newgroupChat.logo = groupLogo;
  let result = await newgroupChat.save();
  if (result) {
    participants.forEach(async (userId) => {
      await User.findByIdAndUpdate(userId, {
        $push: { chats: newgroupChat._id },
      });
    });
  }
  return res.status(200).json(participants);
};

module.exports = { createGroupChat };
