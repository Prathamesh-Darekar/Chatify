const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

// API THAT RETURNS ALL THE CHATS OF A USER
const showChats = async (req, res) => {
  const username = req.params.username;
  if (!username)
    return res.status(400).json({ message: "Please provide username" });
  let arr = [];
  let userDetails, data;
  userDetails = await User.findOne(
    { username: username },
    "-password"
  ).populate("chats", "_id");
  if (!userDetails)
    return res.status(404).json({ message: "Invalid username" });
  for (let chatData of userDetails.chats) {
    let chatname, logo;
    data = await Chat.findById(chatData)
      .populate("latestMessage", "content")
      .populate("users", "username");
    if (data.isGroupChat) {
      chatname = data.chatName;
      logo = data.logo;
    } else {
      if (username != data.users[0].username) {
        chatname = data.users[0].username;
        const user = await User.findById(data.users[0]._id).select("dp");
        logo = user.dp;
      } else {
        chatname = data.users[1].username;
        const user = await User.findById(data.users[1]._id).select("dp");
        logo = user.dp;
      }
    }
    let newObj = {
      chat_id: chatData._id,
      latestMessage: data.latestMessage ? data.latestMessage.content : "",
      chatName: chatname,
      logo,
      newMessage: false,
      isTyping: false,
    };
    arr.push(newObj);
  }
  return res.status(200).json(arr);
};

//API that returns all the details of the chat
const getChatDetails = async (req, res) => {
  const chat_id = req.params.chat_id;
  const username = req.params.username;
  if (!(chat_id && username))
    return res.status(400).json({ message: "Please provide username" });
  let chatDetails = await Chat.findById(chat_id).populate("messages");
  if (!chatDetails) return res.status(404).json({ message: "Invalid chat id" });
  let chatName, user2Id, logo;
  if (chatDetails.isGroupChat) {
    chatName = chatDetails.chatName;
    logo = chatDetails.logo;
  } else {
    let name = await User.findById(chatDetails.users[0], "-password");
    if (name.username != username) {
      chatName = name.username;
      user2Id = chatDetails.users[0];
      logo = name.dp;
    } else {
      let name2 = await User.findById(chatDetails.users[1], "-password");
      chatName = name2.username;
      user2Id = chatDetails.users[1];
      logo = name2.dp;
    }
  }
  let chatMessages = chatDetails.messages;
  let response = {
    chatMessages,
    chatName,
    user2Id,
    groupChat: chatDetails.isGroupChat,
    logo,
  };
  return res.status(200).json(response);
};

// API to create a new one-on-one chat
const createChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res.status(409).json({ message: "Please provide userID" });
  let newChat = new Chat({
    chatName: "Private Chat",
    isGroupChat: false,
    users: [req.user._id, userId],
    laestMessage: "",
    groupAdmin: [],
    messages: [],
  });
  await newChat.save();
  await User.findByIdAndUpdate(req.user._id, { $push: { chats: newChat._id } });
  await User.findByIdAndUpdate(userId, { $push: { chats: newChat._id } });
  return res.status(200).json({ message: "success" });
};

// API to fetch users of a group chat
const getGroupChatParticipants = async (req, res) => {
  const chat_id = req.params.chat_id;
  if (!chat_id)
    return res.status(404).json({ message: "Please provide chat_Id" });
  const chat = await Chat.findById(chat_id)
    .select("chatName isGroupChat logo users")
    .populate({ path: "users", select: "username" });
  return res.status(200).json(chat);
};

// API to edit the chat
const editChat = async (req, res) => {
  const { chat_id } = req.params;
  const newChatInfo = req.body;
  if (!chat_id || !newChatInfo)
    return res
      .status(400)
      .json({ message: "Please provide chat_id and chatInfo" });
  const chat = await Chat.findById(chat_id);
  chat.chatName = newChatInfo.chatName;
  chat.logo = newChatInfo.logo;
  chat.users = newChatInfo.users;
  await chat.save();
  return res.status(200).json({ message: "success" });
};

module.exports = {
  showChats,
  getChatDetails,
  createChat,
  getGroupChatParticipants,
  editChat,
};
