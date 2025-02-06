import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import { userContext } from "../../Context/UserState";
import { socketContext } from "../../Context/SocketState";

const ChatArea = ({ chat_id }) => {
  const user = useContext(userContext);
  const socket = useContext(socketContext);
  const [newMessage, setNewMessage] = useState("");
  const [userChats, setUserChats] = useState([]);
  const [chatName, setChatName] = useState("");
  const [chatLogo, setChatLogo] = useState("");
  const [isGroupChat, setIsGroupChat] = useState(false);
  const chatContainerRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, []); // Runs once when the component mounts

  useEffect(() => {
    scrollToBottom();
  }, [userChats]);

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
          if (response.data.groupChat) {
            socket.socket.emit("join-group", { roomName: chat_id });
            setIsGroupChat(true);
          } else {
            socket.updateRoomId(response.data.user2Id);
          }
        }
      } catch (err) {
        console.log("Error in chatArea.jsx", err);
        alert(err.response?.data?.message || "An error occurred.");
      }
    };
    if (chat_id) getChatMessages();
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
      const msgId = storeMessage(user.userDetails.userId, newMessage, chat_id);
      if (isGroupChat) {
        socket.socket.emit("groupChat", { msg: newMessage, roomName: chat_id });
      } else {
        socket.socket.emit("one-on-one", {
          userId: socket.roomId,
          msg: newMessage,
        });
      }
      const obj = {
        content: newMessage,
        sender: user.userDetails.userId,
        msgId,
      };
      setUserChats((prevArray) => [...prevArray, obj]);
    }
  };

  useEffect(() => {
    socket.socket.on("message", (data) => {
      const obj = {
        content: data,
        sender: 0,
      };
      setUserChats((prevArray) => [...prevArray, obj]);
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
          <Typography sx={{ color: "#888", fontSize: "12px" }}>
            Online
          </Typography>
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
