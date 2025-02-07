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

const ChatArea = ({ chat_id, updateShowChatArea, updateChat, chat }) => {
  const user = useContext(userContext);
  const socket = useContext(socketContext);
  const [newMessage, setNewMessage] = useState("");
  const [userChats, setUserChats] = useState([]);
  const [chatName, setChatName] = useState("");
  const [chatLogo, setChatLogo] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width:700px)");
  const chatId = useRef(chat_id);
  useEffect(() => {
    chatId.current = chat_id;
  }, [chat_id]);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [userChats, isTyping]);

  // Typing indicator
  setTimeout(() => {
    if (newMessage != "") socket.socket.emit("typing", { chat_id });
  }, [2000]);

  // To remove the new message indicator when chatArea is opened
  const removeNewMessageIndicator = () => {
    chat = chat.map((obj) => {
      if (obj.chat_id == chat_id) obj.newMessage = false;
      return obj;
    });
    updateChat(chat);
  };

  useEffect(() => {
    const getChatMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/chat/${user.userDetails.username}/${chat_id}`,
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
        }
      } catch (err) {
        console.log("Error in chatArea.jsx", err);
        alert(err.response?.data?.message || "An error occurred.");
      }
    };
    if (chat_id) getChatMessages();
    return () => removeNewMessageIndicator();
  }, [chat_id]);

  // function to call an API to store new message into database
  const storeMessage = async (s_id, content, c_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/message/new",
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
      console.log("Error in storeMessage:", e);
    }
  };

  const handleSendMessage = () => {
    if (chat_id && newMessage !== "") {
      setIsTyping(false);
      const msgId = storeMessage(user.userDetails.userId, newMessage, chat_id);
      socket.socket.emit("chat-room", { msg: newMessage, chat_id });
      const obj = {
        content: newMessage,
        sender: user.userDetails.userId,
        msgId,
      };
      setUserChats((prevArray) => [...prevArray, obj]);
    }
  };
  // Websocket listener
  useEffect(() => {
    socket.socket.on("message", (data) => {
      const obj = {
        content: data.msg,
        sender: 0,
      };
      if (data.chat_id == chatId.current)
        setUserChats((prevArray) => [...prevArray, obj]);
      return () => socket.socket.off("message");
    });
    socket.socket.on("indicate-typing", (data) => {
      setIsTyping(true);
      setInterval(() => setIsTyping(false), 1000);
    });
  }, []);

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  // Delete a message
  const handleMessageDelete = async (msgId) => {
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
            chatId: chat_id,
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
      console.log("Error in handleMessageDelete:", e);
    }
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
          <IconButton onClick={() => updateShowChatArea()}>
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
        <Box>
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
        {isTyping && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#E5E7EB",
                color: "#333",
                padding: "10px 20px",
                borderRadius: "20px",
                maxWidth: "75%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2">Typing...</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          borderTop: "1px solid #E0E0E0",
          backgroundColor: "#fff",
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
          <SentimentSatisfiedOutlinedIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "#00B0FF" }}>
          <AddOutlinedIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "#4CAF50" }} onClick={handleSendMessage}>
          <SendIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatArea;
