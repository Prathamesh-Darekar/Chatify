import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, TextField } from "@mui/material";
import { userContext } from "../../Context/UserState";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatSelector = ({ updateChat_id, updateChat, chat }) => {
  const user = useContext(userContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showOption, setShowOption] = useState(false);
  // const [chat, setChat] = useState([
  //   { chatName: "", latestMessage: "", chat_id: "", logo: "" },
  // ]);
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
      if (response.status === 200) updateChat(response.data);
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
        background: "linear-gradient(145deg, #F5F5F5, #E0E0E0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
        padding: "20px",
        width: "94%",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Welcome Message */}
      <Box>
        <Typography
          sx={{
            color: "#2C3E50",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: "600",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          Welcome, {user.userDetails.username}!
        </Typography>
      </Box>

      {/* Search Bar and More Options */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#2C3E50",
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
                  <SearchIcon sx={{ color: "#2C3E50" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#BDBDBD",
              },
              "&:hover fieldset": {
                borderColor: "#3498DB",
              },
            },
            "&:hover": {
              backgroundColor: "#F8F9FA",
            },
          }}
        />
        <Box sx={{ position: "relative" }}>
          <MoreVertIcon
            fontSize="large"
            sx={{
              cursor: "pointer",
              color: "#2C3E50",
              "&:hover": { color: "#3498DB" },
            }}
            onClick={handleShowMoreOptions}
          />
          <Box
            sx={{
              position: "absolute",
              background: "#FFFFFF",
              zIndex: "2",
              right: "0",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              display: showOption ? "block" : "none",
              width: "140px",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                cursor: "pointer",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { backgroundColor: "#F8F9FA", color: "#3498DB" },
              }}
              onClick={handleCreateGroup}
            >
              New Group
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { backgroundColor: "#F8F9FA", color: "#E74C3C" },
              }}
              onClick={handleLogOut}
            >
              Logout
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search Results */}
      {displaySearchResults && availableUsers.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "15px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ color: "#2C3E50", fontSize: "18px", fontWeight: "500" }}
            >
              Search Results
            </Typography>
            <Box
              sx={{
                cursor: "pointer",
                color: "#E74C3C",
                "&:hover": { color: "#C0392B" },
              }}
              onClick={() => setDisplaySearchResults(false)}
            >
              X
            </Box>
          </Box>
          {availableUsers.map((chat, index) => (
            <Box
              key={index}
              onClick={() => handleSearchResultClick(chat.user_id)}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#F8F9FA" },
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundImage: `url(${chat.logo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginRight: "12px",
                  border: "2px solid #3498DB",
                }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "#2C3E50", fontWeight: "500" }}>
                  <b>{chat.chatName}</b>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* No User Found */}
      {displaySearchResults && availableUsers.length === 0 && (
        <Box
          sx={{
            border: "1px solid #BDBDBD",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "15px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            sx={{ color: "#2C3E50", fontSize: "18px", fontWeight: "500" }}
          >
            Search Results
          </Typography>
          <Typography sx={{ color: "gray", fontStyle: "italic" }}>
            No User Found
          </Typography>
        </Box>
      )}

      {/* Chat List */}
      {chat.map((chat, index) => (
        <Box
          key={index}
          onClick={() => handleClick(chat.chat_id)}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#F8F9FA" },
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
              marginRight: "12px",
              border: "2px solid #3498DB",
            }}
          />
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ color: "#2C3E50", fontWeight: "500" }}>
              <b>{chat.chatName}</b>
            </Typography>
            <Typography sx={{ color: "gray", fontSize: "14px" }}>
              {chat.latestMessage}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChatSelector;
