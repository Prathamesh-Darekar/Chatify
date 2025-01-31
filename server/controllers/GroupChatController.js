const Chat = require("../models/Chat");
const User = require("../models/User");

// Pending to add logo
const createGroupChat = async (req, res) => {
  let { groupName, participants, groupLogo } = req.body;
  if (!groupName || !participants) return res.status(409).json("bad request");
  participants = participants.map((user) => {
    return user._id;
  });
  participants.push(req.user._id);
  console.log(participants);
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
  return res.status(200).json(participants);
};

module.exports = { createGroupChat };
