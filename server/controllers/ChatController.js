const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

const accessChat = async (req, res) => {
  const userId = req.user._id;

  // // Fetching and populating the chat from DB if present
  let chat = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("latestMessage");
  res.json(chat);
  // if (chat.length > 0) res.json(chat[0]);
  // else {
  //   // Creating a new chat incase not present already
  const newChat = new Chat({
    chatName: "sender",
    users: [req.user._id, "671b2e4c331a110273d5045d"],
  });
  await newChat.save();

  //   // Sending the data back to client
  //   const createdChat = await Chat.find({ _id: newChat._id }).populate(
  //     "users",
  //     "-password"
  //   );
  //   res.json(createdChat);
  // }
};

// API THAT RETURNS ALL THE CHATS OF A USER
const showChats = async (req, res) => {
  const username = req.params.username;
  let arr = [];
  let userDetails, data;
  userDetails = await User.findOne(
    { username: username },
    "-password"
  ).populate("chats", "_id");
  for (let chatData of userDetails.chats) {
    let chatname;
    data = await Chat.findById(chatData)
      .populate("latestMessage", "content")
      .populate("users", "username");
    if (data.isGroupChat) {
      chatname = data.chatName;
    } else {
      if (username != data.users[0].username) chatname = data.users[0].username;
      else chatname = data.users[1].username;
    }
    let newObj = {
      chat_id: chatData._id,
      latestMessage: data.latestMessage.content,
      chatName: chatname,
    };
    arr.push(newObj);
  }
  return res.json(arr);
};

const getChatDetails = async (req, res) => {
  console.log("This is getChatDetails");
  try {
    const chat_id = req.params.chat_id;
    const username = req.params.username;
    let chatDetails = await Chat.findById(chat_id).populate("messages");
    let chatName;
    if (chatDetails.isGroupChat) {
      chatName = chatDetails.chatName;
    } else {
      let name = await User.findById(chatDetails.users[0], "-password");
      if (name.username != username) {
        chatName = name.username;
      } else {
        let name2 = await User.findById(chatDetails.users[1], "-password");
        chatName = name2.username;
      }
    }
    let chatMessages = chatDetails.messages;
    let response = { chatMessages, chatName };
    return res.json(response);
  } catch (err) {
    console.log("Error in getChatDetails server");
  }
};

module.exports = { accessChat, showChats, getChatDetails };
