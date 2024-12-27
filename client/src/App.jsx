import { useContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import User from "./Pages/User";
import Chat from "./Pages/mainPage";
import PageNotFound from "./Pages/PageNotFound";
import Unauthorized from "./Pages/Unauthorized";
import { userContext } from "./Context/UserState";

function App() {
  let user = useContext(userContext);
  return (
    <div>
      <Routes>
        <Route path="/" element={<User />} />
        <Route
          path="/chat"
          element={user.userDetails.userId == "" ? <Unauthorized /> : <Chat />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
