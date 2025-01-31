import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, TextField } from "@mui/material";
import { userContext } from "../../Context/UserState";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const chatSelector = ({ updateChat_id }) => {
  let user = useContext(userContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // to store the search value
  let [searchValue, setSearchValue] = useState("");
  let handleChange = (e) => {
    setSearchValue(e.target.value);
  };
  // To store all the chats of a user
  let [chat, setChat] = useState([
    {
      chatName: "",
      latestMessage: "",
      chat_id: "",
    },
  ]);
  // To store new users (data from the search results)
  let [availableUsers, setAvailableUsers] = useState([]);
  let [displaySearchResults, setDisplaySearchResults] = useState(false);
  let handleSearchClick = async (e) => {
    if (!searchValue) return;
    try {
      // Search for new users to chat
      console.log(user.serverUrl);
      const response = await axios.get(
        `${user.serverUrl}/api/user/finduser/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        if (response.data.length > 0) {
          setAvailableUsers(response.data);
        }
        setDisplaySearchResults(true);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  let fetchChats;
  useEffect(() => {
    // get all the messages of a chat
    fetchChats = async () => {
      try {
        // get the jwt token from local sotrage
        const token = localStorage.getItem("token");
        // request to server with jwt token
        let response = await axios.get(
          `${user.serverUrl}/api/chat/${user.userDetails.username}`,
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

  let handleClick = (chat_id) => {
    // CREATE CHAT
    updateChat_id(chat_id);
  };

  let handleSearchResultClick = async (id) => {
    console.log(id);
    const userId = id;
    try {
      const response = await axios.post(
        `${user.serverUrl}/api/chat/new`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) setDisplaySearchResults(false);
    } catch (e) {
      console.log("Error in chatSelector-handleSearchResultClick  ", e);
    }
  };
  const handleCreateGroup = () => {
    navigate("/creategroup");
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
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
        <Box>
          <GroupAddIcon
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={handleCreateGroup}
          />
        </Box>
      </Box>
      {(() => {
        if (displaySearchResults) {
          if (availableUsers.length > 0) {
            return (
              <Box
                sx={{
                  display: "flex",
                  borderBottom: "1px solid rgba(0,0,0,0.3)",
                  flexDirection: "column",
                  gap: "15px",
                  paddingBottom: "10px",
                }}
              >
                Search Results
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => setDisplaySearchResults(false)}
                >
                  X
                </Box>
                {availableUsers.map((chat, index) => (
                  <Box
                    key={index}
                    onClick={() => handleSearchResultClick(chat.user_id)}
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
                    </Box>
                  </Box>
                ))}
              </Box>
            );
          } else {
            return (
              <Box
                sx={{
                  border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "10px",
                }}
              >
                Search Results
                <Typography>No User Found</Typography>
              </Box>
            );
          }
        }
      })()}
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
