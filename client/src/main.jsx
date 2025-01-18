import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.jsx";
import "./index.css";
import { UserState } from "./Context/UserState.jsx";
import { SocketState } from "./Context/SocketState.jsx";

createRoot(document.getElementById("root")).render(
  <UserState>
    <SocketState>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketState>
  </UserState>
);
