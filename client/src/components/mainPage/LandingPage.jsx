import React from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GroupIcon from "@mui/icons-material/Group";

const LandingPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Chatify
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Experience the joy of seamless communication with friends and teams!
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <Box>
              <ChatIcon sx={{ fontSize: 60, color: "#42a5f5" }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Instant Messaging
              </Typography>
              <Typography color="textSecondary">
                Stay connected anytime with real-time chats.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <EmojiEmotionsIcon sx={{ fontSize: 60, color: "#fbc02d" }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Fun & Interactive
              </Typography>
              <Typography color="textSecondary">
                Express yourself with emojis and more!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <GroupIcon sx={{ fontSize: 60, color: "#66bb6a" }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Group Chats
              </Typography>
              <Typography color="textSecondary">
                Collaborate effectively with group messaging.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
