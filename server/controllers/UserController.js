const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

// API to create a new user
const signUp = async (req, res) => {
  const { username, password, imageUrl } = req.body;
  if (!(username && password))
    return res
      .status(400)
      .json({ message: "Please provide username and password" });

  // Checking if the user already exists or not
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Password encryption using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Saving the user into the database
  const newUser = new User({
    username,
    password: hashedPassword,
  });
  if (imageUrl) {
    newUser.dp = imageUrl;
  }
  await newUser.save();

  // Checking if the user exists or not
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Password validation
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid Password" });

  user.password = "";

  // Generating JWT token
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.status(200).json({ token, user, message: "Welcome to chatify" });
};

// API for user login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password))
    return res
      .status(400)
      .json({ message: "Please provide username and password" });

  // Checking if the user exists or not
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Password validation
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid Password" });

  user.password = "";

  // Generating JWT token
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.status(200).json({ token, user, message: "Welcome to chatify" });
};

const findUser = async (req, res) => {
  const name = req.params.username;
  const u_id = req.params.id;
  let arr = [];
  if (!name || !u_id)
    return res.status(409).json({ message: "Please enter name" });
  const chats = await Chat.find({ users: u_id }).select("users");

  const usersInChats = new Set();
  chats.forEach((chat) => {
    chat.users.forEach((user) => {
      usersInChats.add(user.toString());
    });
  });

  const usersNotInChat = await User.find({
    _id: { $nin: Array.from(usersInChats) },
    username: { $regex: new RegExp(`${name}`, "i") },
  }).select("username dp _id");

  for (let user of usersNotInChat) {
    let newObj = {
      user_id: user._id,
      chatName: user.username,
      logo: user.dp,
    };
    arr.push(newObj);
  }
  return res.json(arr);
};

const getAllUsers = async (req, res) => {
  let allUsers = await User.find(
    { _id: { $ne: req.user._id } },
    { username: 1 }
  );
  if (!allUsers) return res.status(500).json(allUsers);
  else res.status(200).json(allUsers);
};

// API to edit the user information
const editUser = async (req, res) => {
  const { id } = req.params;
  const { username, profilePicture } = req.body;
  if (!id || !username)
    return res.status(400).json({ message: "Please provide username" });
  const user1 = await User.find({ username, _id: { $ne: id } });
  if (user1.length > 0)
    return res.status(400).json({ message: "Username already exists" });
  if (!id || !username || !profilePicture)
    return res.status(400).json({ message: "Bad request" });
  const user = await User.findById(id);
  if (user) {
    (user.username = username), (user.dp = profilePicture);
    await user.save();
    user.password = "";
  } else {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
};

module.exports = { signUp, loginUser, findUser, getAllUsers, editUser };
