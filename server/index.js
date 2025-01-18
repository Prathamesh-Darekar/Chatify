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
function removeObject(array, value) {
  return array.filter((obj) => obj.socketid !== value);
}
let socketInfo = [];
io.on("connection", (socket) => {
  console.log(`user connected with id : ${socket.id}`);
  socket.on("register", (data) => {
    let socketObj = {
      userId: data.userId,
      socketId: socket.id,
    };
    socketInfo.push(socketObj);
  });
  socket.on("one-on-one", ({ msg, userId }) => {
    const result = socketInfo.find((obj) => obj.userId === userId);
    if (result != null) {
      roomId = result.socketId;
      socket.to(roomId).emit("message", msg);
    }
  });
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    removeObject(socketInfo, socket.id);
  });
});

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
  console.log("This is error handling middleware");
  return res.status(status).json({ message });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
