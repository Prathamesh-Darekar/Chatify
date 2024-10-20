const Chat = require("../models/Chat");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  // Checking if the request has userId or not
  if (!userId) {
    return res
      .status(400)
      .json({ message: "User Id not specified in the request" });
  }

  // Fetching and populating the chat from DB if present
  let chat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  if (chat.length > 0) res.json(chat[0]);
  else {
    // Creating a new chat incase not present already
    const newChat = new Chat({
      chatName: "sender",
      users: [req.user._id, userId],
    });
    await newChat.save();

    // Sending the data back to client
    const createdChat = await Chat.find({ _id: newChat._id }).populate(
      "users",
      "-password"
    );
    res.json(createdChat);
  }
};

module.exports = { accessChat };
