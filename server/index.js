const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const userRouter = require("./Routes/UserRouter");
env.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_DATABASE_URL)
  .then(() => console.log("Database Connected!"));

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Server online");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
