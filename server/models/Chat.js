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
