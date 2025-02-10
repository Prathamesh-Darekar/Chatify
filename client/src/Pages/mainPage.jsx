import React, { useState, useContext, useEffect } from "react";
import ChatArea from "../components/mainPage/chatArea";
import LandingPage from "../components/mainPage/LandingPage";
import ChatSelector from "../components/mainPage/chatSelector";
import useMediaQuery from "@mui/material/useMediaQuery"; // Import useMediaQuery
import { userContext } from "../Context/UserState";
import { socketContext } from "../Context/SocketState";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const mainPage = ({
  updateChat_id,
  chat_id,
  showChatArea,
  updateShowChatArea,
}) => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:700px)");
  const token = localStorage.getItem("token");
  const socket = useContext(socketContext);
  const user = useContext(userContext);
  const [flag, setFlag] = useState(true);
  const [chat, setChat] = useState([
    {
      chatName: "",
      latestMessage: "",
      chat_id: "",
      logo: "",
      newMessage: false,
      isTyping: false,
    },
  ]);

  const updateFlag = () => setFlag(!flag);

  const updateChat = (data) => {
    setChat(data);
  };

  //Fetching all the chats of a user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${user.serverUrl}/api/chat/${user.userDetails.username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) setChat(response.data);
      } catch (err) {
        alert(err.response.data.message);
        navigate("/");
      }
    };
    fetchChats();
  }, [flag]);

  // Websocket listener
  useEffect(() => {
    // creates rooms
    chat.map((obj) => {
      socket.socket.emit("join-room", { chat_id: obj.chat_id });
    });
    //fetches message from the sender
    socket.socket.on("message", (data) => {
      let chat1 = chat.map((obj) => {
        if (obj.chat_id == data.chat_id) {
          obj.latestMessage = data.msg;
          obj.newMessage = true;
        }
        return obj;
      });
      setChat(chat1);
    });
    // Checks whether user is typing or not
    socket.socket.on("indicate-typing", (data) => {
      let chat1 = chat.map((obj) => {
        if (data.chat_id == obj.chat_id) obj.isTyping = data.flag;
        return obj;
      });
      setChat(chat1);
    });
  }, [chat]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflowX: "hidden",
      }}
    >
      {!isSmallScreen && (
        <div
          style={{
            width: isSmallScreen ? "100%" : "30%",
            background: "linear-gradient(145deg, #F5F5F5, #E0E0E0)",
            overflowY: "scroll",
          }}
          className="scrollbar-hidden"
        >
          <ChatSelector
            updateChat_id={updateChat_id}
            chat={chat}
            updateFlag={updateFlag}
            updateShowChatArea={updateShowChatArea}
          />
        </div>
      )}
      {!showChatArea && isSmallScreen && (
        <div
          style={{
            width: isSmallScreen ? "100%" : "30%",
            background: "linear-gradient(145deg, #F5F5F5, #E0E0E0)",
            // height: "94vh",
            overflowY: "scroll",
          }}
          className="scrollbar-hidden"
        >
          <ChatSelector
            updateChat_id={updateChat_id}
            chat={chat}
            updateFlag={updateFlag}
            updateShowChatArea={updateShowChatArea}
          />
        </div>
      )}
      {!isSmallScreen && (
        <div style={{ width: "70%", background: "blue" }}>
          {chat_id == "" ? (
            <LandingPage />
          ) : (
            <ChatArea chat_id={chat_id} chat={chat} updateChat={updateChat} />
          )}
        </div>
      )}
      {isSmallScreen && showChatArea && (
        <div style={{ width: "100%", background: "blue" }}>
          {chat_id == "" ? (
            <LandingPage />
          ) : (
            <ChatArea
              chat_id={chat_id}
              updateShowChatArea={updateShowChatArea}
              updateChat={updateChat}
              chat={chat}
              updateFlag={updateFlag}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default mainPage;
