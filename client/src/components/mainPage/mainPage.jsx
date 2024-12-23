import React, { useEffect } from "react";
import { useState } from "react";
import ChatArea from "./chatArea";
import ChatSelector from "./chatSelector";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const mainPage = (props) => {
  const navigate = useNavigate();

  let [chat, setChat] = useState([
    {
      chatName: "prathamesh Darekar",
      latestMessage: "Hi how are you",
    },
  ]);

  let fetchChats;
  let isAuthorized;
  useEffect(() => {
    // get message between 2 users
    fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        let chatData = await axios.get(
          `http://localhost:8080/api/chat/${props.userDetails}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChat(chatData.data);
      } catch (err) {
        console.log("Error in mainPage.jsx component");
        navigate("/");
      }
    };
    fetchChats();
  }, []);
  if (isAuthorized == false) return <div>Not authorized</div>;
  return (
    <div>
      <Grid
        container
        spacing={1}
        sx={{
          padding: "10px",
          width: "100vw",
        }}
      >
        <Grid size={3}>
          <Item
            sx={{
              height: "90vh",
            }}
          >
            <ChatSelector chat={chat} userDetails={props.userDetails} />
          </Item>
        </Grid>
        <Grid size={9}>
          <Item
            sx={{
              height: "90vh",
            }}
          >
            <ChatArea />
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default mainPage;
