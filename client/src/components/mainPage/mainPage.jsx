import React from "react";
import ChatArea from "./chatArea";
import ChatSelector from "./chatSelector";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
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
            <ChatSelector />
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
