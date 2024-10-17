const Chat = require("../models/Chat");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Bad request" });
  }
  let chat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  if (!chat) {
    const newChat = new Chat({});
  }
  console.log(chat);
};

module.exports = { accessChat };
