import React, { useState, useContext, useMemo } from "react";
import ChatArea from "../components/mainPage/chatArea";
import LandingPage from "../components/mainPage/LandingPage";
import ChatSelector from "../components/mainPage/chatSelector";
import useMediaQuery from "@mui/material/useMediaQuery"; // Import useMediaQuery
import { userContext } from "../Context/UserState";
import { socketContext } from "../Context/SocketState";
import { Route, Routes } from "react-router-dom";

const mainPage = () => {
  const isSmallScreen = useMediaQuery("(max-width:700px)");
  const socket = useContext(socketContext);
  const user = useContext(userContext);
  const [chat, setChat] = useState([
    { chatName: "", latestMessage: "", chat_id: "", logo: "" },
  ]);
  // Setting up a websocket
  useMemo(() => {
    console.log(socket);
    socket.socket.emit("register", { userId: user.userDetails.userId });
  }, []);
  // to store the chat id of the selected chat from chat selector
  let [chat_id, setChat_id] = useState("");
  const [showChatArea, setShowChatArea] = useState(false);
  let updateChat_id = (id) => {
    setChat_id(id);
    updateShowChatArea();
  };
  const updateShowChatArea = () => {
    setShowChatArea(!showChatArea);
  };
  const updateChat = (data) => {
    setChat(data);
  };
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
            updateChat={updateChat}
            chat={chat}
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
            updateChat={updateChat}
            chat={chat}
          />
        </div>
      )}
      {!isSmallScreen && (
        <div style={{ width: "70%", background: "blue" }}>
          {chat_id == "" ? (
            <LandingPage />
          ) : (
            <ChatArea chat_id={chat_id} updateChat={updateChat} chat={chat} />
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
            />
          )}
        </div>
      )}
    </div>
  );
};

export default mainPage;
