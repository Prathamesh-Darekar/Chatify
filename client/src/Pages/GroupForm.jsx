import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";
import { userContext } from "../Context/UserState";
import { useNavigate } from "react-router-dom";

const GroupForm = () => {
  // State to manage form inputs
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [groupIcon, setGroupIcon] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = useContext(userContext);

  // API call to get all available users
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${user.serverUrl}/api/user/getuser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status == 200) {
          setAllUsers(response.data);
        }
      } catch (e) {
        alert(e.response?.data?.message || "An error occurred.");
        console.log("Error in GroupForm component", e);
      }
    };
    getUser();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${user.serverUrl}/api/groupchat/new`,
        {
          groupName,
          participants: selectedParticipants,
          groupLogo: groupIcon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        navigate("/chat");
        alert("Group created successfully..!!");
      }
    } catch (e) {
      console.log("Error in group create Form");
      alert(e.response?.data?.message || "An error occurred.");
    }
    setIsLoading(false);
  };

  // Handle file upload for group icon
  const handleFileChange = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Chatify");
    formData.append("cloud_name", "prathamesh19");
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/prathamesh19/image/upload`,
      formData
    );
    if (res.status == 200) setGroupIcon(res.data.url);
    setIsLoading(false);
  };

  // Handle participant selection
  const handleParticipantChange = (event, value) => {
    setSelectedParticipants(value);
  };

  // Handle removing a participant
  const handleRemoveParticipant = (participantToRemove) => {
    setSelectedParticipants((prev) =>
      prev.filter((participant) => participant.id !== participantToRemove.id)
    );
  };

  // Handle removing the group icon
  const handleRemoveIcon = () => {
    setGroupIcon(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create New Group
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Group Name Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Group Name"
              variant="outlined"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </Grid>

          {/* Group Participants Field */}
          <Grid item xs={12}>
            {(() => {
              if (allUsers) {
                return (
                  <Autocomplete
                    multiple
                    options={allUsers}
                    getOptionLabel={(option) => `${option.username}`}
                    value={selectedParticipants}
                    onChange={handleParticipantChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Participants"
                        placeholder="Select participants"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option._id}
                          label={`${option.username}`}
                          onDelete={() => handleRemoveParticipant(option)}
                          deleteIcon={<Close />}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                );
              }
            })()}
          </Grid>

          {/* Group Icon Upload */}
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="icon-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body1" sx={{ ml: 2, paddingRight: "15px" }}>
              {groupIcon ? "Icon Uploaded" : "Upload Group Icon"}
            </Typography>
            {isLoading && <CircularProgress size={24} />}
            {groupIcon && (
              <>
                <Avatar
                  src={groupIcon}
                  alt="Group Icon"
                  sx={{ ml: 2, width: 56, height: 56 }}
                />
                <IconButton
                  color="error"
                  onClick={handleRemoveIcon}
                  sx={{ ml: 1 }}
                >
                  <Close />
                </IconButton>
              </>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              {isLoading ? (
                <CircularProgress color="white" size={24} />
              ) : (
                "Create Group"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default GroupForm;
