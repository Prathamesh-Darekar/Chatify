const Message = require("../models/Message");
const Chat = require("../models/Chat");

const createMessage = async (req, res) => {
  console.log("hi");
  const { senderId, msg, chatId } = req.body;
  if (!senderId || !msg || !chatId) {
    return res.status(400).json({ error: "All fields are required." });
  }
  let newMessage = new Message({
    sender: senderId,
    content: msg,
    chat: chatId,
  });
  await newMessage.save();
  await Chat.findByIdAndUpdate(chatId, {
    $push: { messages: newMessage._id },
    latestMessage: newMessage._id,
  });
  res.status(200).json("success");
};

module.exports = { createMessage };
