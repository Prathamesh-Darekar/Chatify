import React from "react";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const chatArea = () => {
  let [message, setMessage] = useState("");

  let [userChats, setUserChats] = useState([
    {
      role: "sender",
      message: "hi how are you doing",
    },
    {
      role: "receiver",
      message: "hi how are you doing",
    },
    {
      role: "sender",
      message: "hi how are you doing",
    },
    {
      role: "sender",
      message: "hi how are you doing",
    },
  ]);

  const handleClick = (event) => {
    console.log(message);
    setUserChats([...userChats, { role: "receiver", message }]);
    setMessage("");
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          id="chat-header"
          sx={{
            marginBottom: "20px",
            padding: "5px 20px",
            borderBottom: "1px solid #F7F6F4",
          }}
        >
          <Box
            id="chat"
            sx={{
              // border: "1px solid red",
              display: "flex",
              alignItems: "center",
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
                <b>Prathamesh Darekar</b>
              </Typography>
              <Typography
                sx={{
                  color: "#5B6372",
                  fontSize: "12px",
                }}
              >
                Online
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          p={2}
          sx={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {userChats.map((user, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#015D4B",
                color: "#fff",
                alignSelf: user.role == "sender" ? "flex-end" : "flex-start",
                padding: "10px 20px",
                borderRadius: "20px",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>{user.message}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          borderTop: "2px solid #F7F6F4",
        }}
      >
        <TextField
          name="message"
          value={message}
          id="standard-basic"
          variant="standard"
          placeholder="Message"
          size="medium"
          required
          sx={{
            width: "80%",
          }}
          onChange={handleChange}
        />
        <SentimentSatisfiedOutlinedIcon
          sx={{ cursor: "pointer" }}
          color="primary"
          fontSize="large"
        />
        <AddOutlinedIcon
          sx={{ cursor: "pointer" }}
          color="primary"
          fontSize="large"
        />
        <SendIcon
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={handleClick}
          fontSize="large"
        />
      </Box>
    </div>
  );
};

export default chatArea;
