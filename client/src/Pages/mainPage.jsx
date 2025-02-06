import React, { useEffect, useState, useContext, useMemo } from "react";
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
    setShowChatArea(!showChatArea);
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
      {!showChatArea && (
        <div
          style={{
            width: isSmallScreen ? "100%" : "30%",
            background: "#B3B3B3",
            // height: "94vh",
            overflowY: "scroll",
            padding: "10px",
          }}
          className="scrollbar-hidden"
        >
          <div
            style={{
              fontWeight: "600",
              fontSize: "25PX",
              // color: "white",
              textAlign: "center",
            }}
          >
            Chatify
          </div>
          <ChatSelector updateChat_id={updateChat_id} />
        </div>
      )}
      {!isSmallScreen && (
        <div style={{ width: "70%", background: "blue" }}>
          {chat_id == "" ? <LandingPage /> : <ChatArea chat_id={chat_id} />}
        </div>
      )}
      {isSmallScreen && showChatArea && (
        <div style={{ width: "100%", background: "blue" }}>
          {chat_id == "" ? <LandingPage /> : <ChatArea chat_id={chat_id} />}
        </div>
      )}
    </div>
  );
};

export default mainPage;
