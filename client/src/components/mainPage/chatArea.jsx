import React, { useState, useEffect, useContext, useMemo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import { userContext } from "../../Context/UserState";
import { socketContext } from "../../Context/SocketState";

const chatArea = ({ chat_id }) => {
  let user = useContext(userContext);
  let socket = useContext(socketContext);
  // stores the value entered in the textfield of chatarea
  let [newMessage, setNewMessage] = useState("");
  // to store all the mesages of a chat
  let [userChats, setUserChats] = useState([]);
  let [chatName, setChatName] = useState("");
  useEffect(() => {
    let getChatMessages = async () => {
      try {
        // get the jwt token from local sotrage
        const token = localStorage.getItem("token");
        // ADD API CALL TO FETCH THE MESSAGES OF THE CHAT BASED ON chat_id
        let response = await axios.get(
          `http://localhost:8080/api/chat/${user.userDetails.username}/${chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          setUserChats(response.data.chatMessages);
          setChatName(response.data.chatName);
          socket.updateRoomId(response.data.user2Id);
        }
      } catch (err) {
        console.log("Error in chatArea.jsx");
        alert(err.response.data.message);
      }
    };
    if (chat_id) getChatMessages();
  }, [chat_id]);

  // function to call an api to store new message into database
  const storeMessage = async (s_id, content, c_id) => {
    try {
      // get the jwt token from local sotrage
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
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendMessage = () => {
    // PENDING...
    if (chat_id && newMessage != "") {
      socket.socket.emit("one-on-one", {
        userId: socket.roomId,
        msg: newMessage,
      });
      let obj = {
        content: newMessage,
        sender: user.userDetails.userId,
      };
      setUserChats((prevArray) => [...prevArray, obj]);
      storeMessage(user.userDetails.userId, newMessage, chat_id);
    }
  };

  useEffect(() => {
    socket.socket.on("message", (data) => {
      let obj = {
        content: data,
        sender: 0,
      };
      setUserChats((prevArray) => [...prevArray, obj]);
    });
  }, []);

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          id="chat-header"
          sx={{
            marginBottom: "20px",
            padding: "5px 20px",
            borderBottom: "1px solid #F7F6F4",
          }}
        >
          <Box
            id="chat"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              id="dp"
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "1px solid blue",
                marginRight: "8px",
              }}
            ></Box>
            <Box id="content" sx={{ textAlign: "left" }}>
              <Typography>
                <b>{chatName}</b>
              </Typography>
              <Typography
                sx={{
                  color: "#5B6372",
                  fontSize: "12px",
                }}
              >
                Online
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          p={2}
          sx={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "scroll",
            height: "24rem",
          }}
        >
          {userChats.map((User, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#015D4B",
                color: "#fff",
                alignSelf:
                  User.sender == user.userDetails.userId
                    ? "flex-end"
                    : "flex-start",
                padding: "10px 20px",
                borderRadius: "20px",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>{User.content}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          borderTop: "2px solid #F7F6F4",
        }}
      >
        <TextField
          name="message"
          value={newMessage}
          id="standard-basic"
          variant="standard"
          placeholder="Message"
          size="medium"
          required
          sx={{
            width: "80%",
          }}
          onChange={handleChange}
        />
        <SentimentSatisfiedOutlinedIcon
          sx={{ cursor: "pointer" }}
          color="primary"
          fontSize="large"
        />
        <AddOutlinedIcon
          sx={{ cursor: "pointer" }}
          color="primary"
          fontSize="large"
        />
        <SendIcon
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={handleSendMessage}
          fontSize="large"
        />
      </Box>
    </div>
  );
};

export default chatArea;
