const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { isLoggedin, isAuthorized } = require("./middleware");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const DATABASE_URL = "mongodb://127.0.0.1:27017/chatify";

mongoose.connect(DATABASE_URL).then(() => console.log("Database Connected!"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(201).json({ message: "Invalid Password" });
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    "mysecretKey@%$#",
    { expiresIn: "24h" }
  );
  console.log(token);
  res.json({ token });
});

app.get("/home", isAuthorized, (req, res) => {
  console.log("i am home");
  res.send("home");
});

app.get("/", (req, res) => {
  res.send("Server online");
});
