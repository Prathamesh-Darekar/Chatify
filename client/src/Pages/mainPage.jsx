import React, { useState } from "react";
import ChatArea from "../components/mainPage/chatArea";
import ChatSelector from "../components/mainPage/chatSelector";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

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

const mainPage = () => {
  // to store the chat id of the selected chat from chat selector
  let [chat_id, setChat_id] = useState("");

  let updateChat_id = (id) => {
    setChat_id(id);
  };
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
            <ChatSelector updateChat_id={updateChat_id} />
          </Item>
        </Grid>
        <Grid size={9}>
          <Item
            sx={{
              height: "90vh",
            }}
          >
            <ChatArea chat_id={chat_id} />
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default mainPage;
