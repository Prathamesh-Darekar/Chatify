import React, { createContext, useMemo, useState, useEffect } from "react";
import { io } from "socket.io-client";
const socketContext = createContext();

const SocketState = (props) => {
  const socket = useMemo(() => io("http://localhost:8080"), []);
  let [roomId, setRoomId] = useState(0);
  const updateRoomId = (id) => {
    setRoomId(id);
  };
  useEffect(() => {
    console.log("user", roomId);
  }, [roomId]);
  return (
    <socketContext.Provider value={{ socket, updateRoomId, roomId }}>
      {props.children}
    </socketContext.Provider>
  );
};

export { SocketState, socketContext };
