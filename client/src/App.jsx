import { useContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import User from "./Pages/User";
import Chat from "./Pages/mainPage";
import PageNotFound from "./Pages/PageNotFound";
import Unauthorized from "./Pages/Unauthorized";
import GroupForm from "./Pages/GroupForm";
import EditGroupInfo from "./Pages/EditGroupInfo";
import { userContext } from "./Context/UserState";

function App() {
  let user = useContext(userContext);
  const [showChatArea, setShowChatArea] = useState(false);
  const [chat_id, setChat_id] = useState("");
  const updateShowChatArea = () => {
    setShowChatArea(!showChatArea);
  };
  const updateChat_id = (id) => {
    setChat_id(id);
    updateShowChatArea();
  };
  return (
    <div>
      <Routes>
        <Route
          path="/chat"
          element={
            !user.userDetails ? (
              <Unauthorized />
            ) : (
              <Chat
                updateChat_id={updateChat_id}
                chat_id={chat_id}
                updateShowChatArea={updateShowChatArea}
              />
            )
          }
        />
        <Route
          path="/:chat_id/edit"
          element={<EditGroupInfo updateChat_id={updateChat_id} />}
        />
        <Route path="/creategroup" element={<GroupForm />} />
        <Route path="/" element={<User />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
