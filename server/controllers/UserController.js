const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Username or email already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid Password" });
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  console.log(token);
  res.json({ token });
};

module.exports = { signUp, loginUser };