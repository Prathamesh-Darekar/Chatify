const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  dp: {
    type: String,
    default:
      "http://res.cloudinary.com/prathamesh19/image/upload/v1738688808/cuwiwp0w86bk8vkeopgm.jpg",
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
