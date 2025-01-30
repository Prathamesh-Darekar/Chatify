const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  chatName: {
    type: String,
    trim: true,
    required: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  logo: {
    type: String,
    default: "https://images.app.goo.gl/UGf4WrmaiQtraA5YA",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  groupAdmin: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
