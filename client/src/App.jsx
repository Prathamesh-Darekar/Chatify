import { useContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import User from "./Pages/User";
import Chat from "./Pages/mainPage";
import PageNotFound from "./Pages/PageNotFound";
import Unauthorized from "./Pages/Unauthorized";
import GroupForm from "./Pages/GroupForm";
import { userContext } from "./Context/UserState";

function App() {
  let user = useContext(userContext);
  console.log("hi from app.jsx");
  return (
    <div>
      <Routes>
        <Route
          path="/chat"
          element={!user.userDetails ? <Unauthorized /> : <Chat />}
        />
        <Route path="/creategroup" element={<GroupForm />} />
        <Route path="/" element={<User />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
