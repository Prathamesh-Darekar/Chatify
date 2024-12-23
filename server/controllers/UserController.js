const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const signUp = async (req, res) => {
  const { username, password } = req.body;

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
  await newUser.save();

  // Checking if the user exists or not
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Password validation
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid Password" });

  // Generating JWT token
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  console.log(token);
  res.status(200).json({ token, user, message: "Welcome to chatify" });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Checking if the user exists or not
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Password validation
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid Password" });

  // Generating JWT token
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  console.log(token);
  res.status(200).json({ token, user, message: "Welcome to chatify" });
};

//PENDING...
const getAllUsers = async (req, res) => {
  let data = await User.find().populate("chats");
  return res.json(data);
};

module.exports = { signUp, loginUser, getAllUsers };
