import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import User from "./Pages/User";
import Chat from "./Pages/mainPage";
import PageNotFound from "./Pages/PageNotFound";
import Unauthorized from "./Pages/Unauthorized";

function App() {
  let [userDetails, setUserDetails] = useState({
    userId: "",
    username: "",
  });
  let updateUserDetails = (username) => {
    setUserDetails(username);
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<User updateUser={updateUserDetails} />} />
        <Route
          path="/chat"
          element={
            userDetails.userId == "" ? (
              <Unauthorized />
            ) : (
              <Chat userDetails={userDetails} />
            )
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
