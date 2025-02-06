import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, TextField } from "@mui/material";
import { userContext } from "../../Context/UserState";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatSelector = ({ updateChat_id }) => {
  const user = useContext(userContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showOption, setShowOption] = useState(false);
  const [chat, setChat] = useState([
    { chatName: "", latestMessage: "", chat_id: "", logo: "" },
  ]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [displaySearchResults, setDisplaySearchResults] = useState(false);

  const handleChange = (e) => setSearchValue(e.target.value);

  const handleSearchClick = async () => {
    if (!searchValue) return;
    try {
      const response = await axios.get(
        `${user.serverUrl}/api/user/finduser/${searchValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        if (response.data.length > 0) setAvailableUsers(response.data);
        setDisplaySearchResults(true);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `${user.serverUrl}/api/chat/${user.userDetails.username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) setChat(response.data);
    } catch (err) {
      alert(err.response.data.message);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleClick = (chat_id) => {
    updateChat_id(chat_id);
  };

  const handleSearchResultClick = async (id) => {
    try {
      const response = await axios.post(
        `${user.serverUrl}/api/chat/new`,
        { userId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) setDisplaySearchResults(false);
    } catch (e) {
      console.log("Error in chatSelector-handleSearchResultClick", e);
    }
  };

  const handleCreateGroup = () => navigate("/creategroup");
  const handleShowMoreOptions = () => setShowOption(!showOption);
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        // background: "#F5F5F5",
        background: "#B3B3B3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
        padding: "15px",
        width: "100%",
      }}
    >
      <Box>
        <Typography
          sx={{ color: "#333333", fontSize: "20px", textAlign: "center" }}
        >
          Welcome {user.userDetails.username}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#333333",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          name="searchResult"
          value={searchValue}
          size="small"
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearchClick}>
                  <SearchIcon sx={{ color: "#333333" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "5px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#BDBDBD",
              },
            },
            "&:hover": {
              backgroundColor: "#F1F1F1",
            },
          }}
        />
        <Box sx={{ position: "relative" }}>
          <MoreVertIcon
            fontSize="large"
            sx={{ cursor: "pointer", color: "#333333" }}
            onClick={handleShowMoreOptions}
          />
          <Box
            sx={{
              position: "absolute",
              background: "#FFFFFF",
              zIndex: "2",
              right: "0",
              borderRadius: "7px",
              display: showOption ? "block" : "none",
              width: "120px",
            }}
          >
            <Typography
              sx={{
                cursor: "pointer",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { backgroundColor: "#F1F1F1", color: "black" },
              }}
              onClick={handleCreateGroup}
            >
              New Group
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { backgroundColor: "#F1F1F1", color: "black" },
              }}
              onClick={handleLogOut}
            >
              Logout
            </Typography>
          </Box>
        </Box>
      </Box>
      {displaySearchResults && availableUsers.length > 0 && (
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            flexDirection: "column",
            gap: "15px",
            paddingBottom: "10px",
            backgroundColor: "#B3B3B3",
          }}
        >
          <Typography sx={{ color: "#333333", fontSize: "16px" }}>
            Search Results
          </Typography>
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
                "&:hover": { backgroundColor: "#F1F1F1" },
              }}
            >
              <Box
                sx={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  backgroundImage: `url(${chat.logo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginRight: "8px",
                }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#333333" }}>
                  <b>{chat.chatName}</b>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      {displaySearchResults && availableUsers.length === 0 && (
        <Box
          sx={{
            border: "1px solid #BDBDBD",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "10px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Typography sx={{ color: "#333333" }}>Search Results</Typography>
          <Typography sx={{ color: "gray" }}>No User Found</Typography>
        </Box>
      )}
      {chat.map((chat, index) => (
        <Box
          key={index}
          onClick={() => handleClick(chat.chat_id)}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            "&:hover": { backgroundColor: "#F1F1F1" },
          }}
        >
          <Box
            sx={{
              width: "65px",
              height: "65px",
              borderRadius: "50%",
              backgroundImage: `url(${chat.logo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginRight: "8px",
            }}
          />
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ color: "#333333" }}>
              <b>{chat.chatName}</b>
            </Typography>
            <Typography sx={{ color: "gray", fontSize: "12px" }}>
              {chat.latestMessage}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChatSelector;
