import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, TextField } from "@mui/material";

const chatSelector = ({ userDetails, updateChat_id }) => {
  const navigate = useNavigate();
  // to store the search value
  let [searchValue, setSearchValue] = useState("");
  let handleChange = (e) => {
    setSearchValue(e.target.value);
  };
  let handleSearchClick = async (e) => {
    console.log(searchValue);
    //PENDING....
  };

  // To store all the chats of a user
  let [chat, setChat] = useState([
    {
      chatName: "",
      latestMessage: "",
      chat_id: "",
    },
  ]);

  let fetchChats;
  useEffect(() => {
    // get all the messages of a chat
    fetchChats = async () => {
      try {
        // get the jwt token from local sotrage
        const token = localStorage.getItem("token");
        // request to server with jwt token
        let response = await axios.get(
          `http://localhost:8080/api/chat/${userDetails.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) setChat(response.data);
      } catch (err) {
        console.log("Error in mainPage.jsx component");
        alert(err.response.data.message);
        navigate("/");
      }
    };
    fetchChats();
  }, []);

  let handleClick = async (chat_id) => {
    updateChat_id(chat_id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search..."
        name="searchResult"
        value={searchValue}
        onChange={handleChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {chat.map((chat, index) => (
        <Box
          key={index}
          id="chat"
          onClick={() => handleClick(chat.chat_id)}
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
              <b>{chat.chatName}</b>
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
