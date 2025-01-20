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
  res.status(200).json({ msg: "success", msgId: newMessage._id });
};

const deleteMessage = async (req, res) => {
  const { msgId, chatId } = req.body;
  if (!msgId) return res.status(409).json({ msg: "bad request" });
  await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { messages: msgId } },
    { new: true }
  ).then(async (updatedChat) => {
    if (updatedChat.messages.length > 0) {
      updatedChat.latestMessage =
        updatedChat.messages[updatedChat.messages.length - 1];
      await updatedChat.save();
    } else {
      updatedChat.latestMessage = null;
      await updatedChat.save();
    }
  });
  await Message.findByIdAndDelete(msgId);
  res.status(200).json("success");
};

module.exports = { createMessage, deleteMessage };
