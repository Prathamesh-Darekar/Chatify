const Message = require("../models/Message");
const Chat = require("../models/Chat");

// API to create a new message to a chat
const createMessage = async (req, res) => {
  const { senderId, msg, chatId } = req.body;
  if (!senderId || !msg || !chatId) {
    return res.status(400).json({ message: "All fields are required." });
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
  res.status(200).json({ message: "success", msgId: newMessage._id });
};

// API to delete a message from the chat
const deleteMessage = async (req, res) => {
  const { msgId, chatId } = req.body;
  if (!msgId || !chatId)
    return res.status(409).json({ message: "Please provide msgId and chatId" });
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
  res.status(200).json({ message: "success" });
};

module.exports = { createMessage, deleteMessage };
