import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, TextField } from "@mui/material";

const chatSelector = ({ chat, userDetails, updateChat_id }) => {
  let [searchValue, setSearchValue] = useState("");
  let handleChange = (e) => {
    setSearchValue(e.target.value);
  };
  let handleSearchClick = async (e) => {
    console.log(searchValue);
    //PENDING....
  };

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
