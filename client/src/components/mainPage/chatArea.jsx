import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import { userContext } from "../../Context/UserState";
import { socketContext } from "../../Context/SocketState";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMediaQuery } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";

const ChatArea = ({
  chat_id,
  updateShowChatArea,
  updateChat,
  chat,
  updateFlag,
}) => {
  const user = useContext(userContext);
  const socket = useContext(socketContext);
  const [newMessage, setNewMessage] = useState("");
  const [userChats, setUserChats] = useState([]);
  const userChatsRef = useRef(userChats);
  const [chatName, setChatName] = useState("");
  const [chatLogo, setChatLogo] = useState("");
  const [groupChat, setGroupChat] = useState(null);
  const chatContainerRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width:700px)");
  const chatId = useRef(chat_id);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();

  // Function to handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevValue) => prevValue + emojiObject.emoji);
  };

  // useRef()
  useEffect(() => {
    chatId.current = chat_id;
  }, [chat_id]);

  useEffect(() => {
    userChatsRef.current = userChats;
  }, [userChats]);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [userChats, chat]);

  // Typing indicator
  setTimeout(() => {
    if (newMessage == "")
      socket.socket.emit("typing", { chat_id, flag: false });
    else socket.socket.emit("typing", { chat_id, flag: true });
  }, [1000]);

  // To remove the new message indicator when chatArea is opened
  const removeNewMessageIndicator = () => {
    chat = chat.map((obj) => {
      if (obj.chat_id == chat_id) obj.newMessage = false;
      return obj;
    });
    updateChat(chat);
  };

  // To fetch all the messages of a chat
  useEffect(() => {
    const getChatMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${user.serverUrl}/api/chat/${user.userDetails.username}/${chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setUserChats(response.data.chatMessages);
          setChatName(response.data.chatName);
          setChatLogo(response.data.logo);
          setGroupChat(response.data.groupChat);
        }
      } catch (edit) {
        console.log("Error in chatArea.jsx", e);
        alert(e.response?.data?.message || "An error occurred.");
      }
    };
    if (chat_id) getChatMessages();
    return () => removeNewMessageIndicator();
  }, [chat_id]);

  // API call to store new message into database
  const storeMessage = async (s_id, content, c_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${user.serverUrl}/api/message/new`,
        {
          senderId: s_id,
          msg: content,
          chatId: c_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.msgId;
    } catch (e) {
      alert(e.response?.data?.message || "An error occurred.");
      console.log("Error in storeMessage:", e);
    }
  };

  // Handling messages in realtime
  const handleSendMessage = async () => {
    if (chat_id && newMessage !== "") {
      const msgId = await storeMessage(
        user.userDetails.userId,
        newMessage,
        chat_id
      );
      socket.socket.emit("chat-room", { msg: newMessage, chat_id, msgId });
      const obj = {
        content: newMessage,
        sender: user.userDetails.userId,
        _id: msgId,
      };
      setUserChats((prevArray) => [...prevArray, obj]);
      setNewMessage("");
    }
  };

  // Websocket listener
  useEffect(() => {
    //fetches message from the sender in realtime
    socket.socket.on("message", (data) => {
      const obj = {
        content: data.msg,
        sender: 0,
        _id: data.msgId,
      };
      if (data.chat_id == chatId.current)
        setUserChats((prevArray) => [...prevArray, obj]);
      return () => socket.socket.off("message");
    });
    // deletes the message in realtime
    socket.socket.on("deleted-message", (data) => {
      let newUserChats = userChatsRef.current.filter(
        (message) => message._id != data.msgId
      );
      setUserChats(newUserChats);
    });
  }, []);

  //Storing new message into newMessage state
  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  // API call to delete a message
  const handleMessageDelete = async (msgId) => {
    socket.socket.emit("delete-message", { msgId, chat_id: chatId.current });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${user.serverUrl}/api/message/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            msgId,
            chatId: chatId.current,
          },
        }
      );
      if (response.status === 200) {
        const newChatsArray = userChats.filter(
          (message) => message._id !== msgId
        );
        setUserChats(newChatsArray);
      }
    } catch (e) {
      alert(e.response?.data?.message || "An error occurred.");
      console.log("Error in handleMessageDelete:", e);
    }
  };
  const handleBackClick = () => {
    updateShowChatArea();
    updateFlag();
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F6F8",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          padding: "15px 20px",
          borderBottom: "1px solid #E0E0E0",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isSmallScreen && (
          <IconButton onClick={handleBackClick}>
            <ArrowBackIcon fontSize="large" />
          </IconButton>
        )}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundImage: `url(${chatLogo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginRight: "15px",
          }}
        />
        <Box
          onClick={() => (groupChat ? navigate(`/${chatId.current}/edit`) : "")}
          sx={{ cursor: "pointer" }}
        >
          <Typography variant="h6">{chatName}</Typography>
        </Box>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          height: "24rem",
        }}
        ref={chatContainerRef}
      >
        {userChats.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.sender === user.userDetails.userId
                  ? "flex-end"
                  : "flex-start",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  message.sender === user.userDetails.userId
                    ? "#3B82F6"
                    : "#E5E7EB",
                color:
                  message.sender === user.userDetails.userId ? "#fff" : "#333",
                padding: "10px 20px",
                borderRadius: "20px",
                maxWidth: "75%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2">{message.content}</Typography>
            </Box>
            <IconButton
              onClick={() => handleMessageDelete(message._id)}
              sx={{ color: "#FF6B6B" }}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {chat.map((obj) => {
          if (obj && obj.chat_id == chatId.current && obj.isTyping) {
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    // backgroundColor: "#E5E7EB",
                    color: "green",
                    padding: "7px 17px",
                    borderRadius: "20px",
                    maxWidth: "75%",
                    // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="body2" fontSize={14}>
                    Typing...
                  </Typography>
                </Box>
              </Box>
            );
          }
        })}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          borderTop: "1px solid #E0E0E0",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <TextField
          value={newMessage}
          onChange={handleChange}
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          sx={{
            borderRadius: "20px",
            backgroundColor: "#F0F2F5",
            marginRight: "10px",
          }}
        />
        <IconButton sx={{ color: "#FFEB3B" }}>
          <SentimentSatisfiedOutlinedIcon
            fontSize="large"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </IconButton>
        <IconButton sx={{ color: "#00B0FF" }}>
          <AddOutlinedIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "#4CAF50" }} onClick={handleSendMessage}>
          <SendIcon fontSize="large" />
        </IconButton>
        {showEmojiPicker && (
          <Box sx={{ position: "absolute", bottom: "70px", right: "110px" }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatArea;
