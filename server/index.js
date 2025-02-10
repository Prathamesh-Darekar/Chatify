const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const userRouter = require("./Routes/UserRouter");
const chatRouter = require("./Routes/chatRouter");
const messageRouter = require("./Routes/MessageRouter");
const groupChatRouter = require("./Routes/groupChatRouter");
const cloudinary = require("cloudinary");

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

// WEB-SOCKET
io.on("connection", (socket) => {
  console.log(`user connected with id : ${socket.id}`);
  socket.on("join-room", ({ chat_id }) => {
    socket.join(chat_id);
  });
  socket.on("chat-room", ({ msg, chat_id, msgId }) => {
    socket.to(chat_id).emit("message", { msg, chat_id, msgId });
  });
  socket.on("typing", ({ chat_id, flag }) => {
    socket.to(chat_id).emit("indicate-typing", { chat_id, flag });
  });
  socket.on("delete-message", ({ msgId, chat_id }) => {
    socket.to(chat_id).emit("deleted-message", { msgId });
  });
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes related to User
app.use("/api/user", userRouter);
// Routes related to Chat
app.use("/api/chat", chatRouter);
// Routes related to message
app.use("/api/message", messageRouter);
// ROutes related to groups
app.use("/api/groupchat", groupChatRouter);

//API to delete the image from cloudinary asset
app.delete("/api/cloudinary/delete", async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId)
      return res.status(400).json({ error: "Public ID is required" });
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete image", details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  return res.status(status).json({ message });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
