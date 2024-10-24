import React from "react";
import { useState } from "react";
import { Box, Typography } from "@mui/material";

const chatSelector = ({ chat }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      {chat.map((chat, index) => (
        <Box
          key={index}
          id="chat"
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <Box
            id="dp"
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "1px solid blue",
              marginRight: "8px",
            }}
          ></Box>
          <Box id="content" sx={{ textAlign: "left" }}>
            <Typography>
              <b>{chat.username}</b>
            </Typography>
            <Typography
              sx={{
                color: "#5B6372",
                fontSize: "12px",
              }}
            >
              {chat.latestMessage}
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default chatSelector;
