import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";
import { io } from "socket.io-client";
import { userContext } from "./UserState";

const socketContext = createContext();

const SocketState = (props) => {
  const user = useContext(userContext);
  const socket = useMemo(() => io(user.serverUrl), []);
  return (
    <socketContext.Provider value={{ socket }}>
      {props.children}
    </socketContext.Provider>
  );
};

export { SocketState, socketContext };
