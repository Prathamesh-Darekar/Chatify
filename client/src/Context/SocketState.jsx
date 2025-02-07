import React, { createContext, useMemo, useState, useEffect } from "react";
import { io } from "socket.io-client";
const socketContext = createContext();

const SocketState = (props) => {
  const socket = useMemo(() => io("http://localhost:8080"), []);
  return (
    <socketContext.Provider value={{ socket }}>
      {props.children}
    </socketContext.Provider>
  );
};

export { SocketState, socketContext };
