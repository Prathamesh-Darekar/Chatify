import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import User from "./components/User/User";
import Chat from "./components/mainPage/mainPage";

function App() {
  let [userDetails, setUserDetails] = useState({
    userId: "",
    username: "",
  });
  let updateUserDetails = (username) => {
    setUserDetails(username);
  };
  console.log(userDetails);
  return (
    <div>
      <Routes>
        <Route path="/" element={<User updateUser={updateUserDetails} />} />
        <Route path="/chat" element={<Chat userDetails={userDetails} />} />
      </Routes>
    </div>
  );
}

export default App;
