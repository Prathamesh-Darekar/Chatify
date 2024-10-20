const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const userRouter = require("./Routes/UserRouter");
const chatRouter = require("./Routes/chatRouter");

// configuring dotenv
env.config();

app.use(cors());

//Middleware to parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_DATABASE_URL)
  .then(() => console.log("Database Connected!"));

// Routes related to User
app.use("/api/user", userRouter);
// Routes related to Chat
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Server online");
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = "500", message = "Something went wrong" } = err;
  return res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
