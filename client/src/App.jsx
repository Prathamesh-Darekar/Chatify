import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Container, Box, Tab, Tabs, Typography } from "@mui/material";
import User from "./components/User/User";
import Chat from "./components/mainPage/mainPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/user" element={<User />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
