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
import { useNavigate, useParams } from "react-router-dom";

// CreateGroup Component
const EditGroup = ({ updateChat_id }) => {
  const [groupName, setGroupName] = useState("sss");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [groupIcon, setGroupIcon] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { chat_id } = useParams();
  const user = useContext(userContext);

  // API call to get all available users
  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUser = async () => {
      try {
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
    const getChatInfo = async () => {
      try {
        const response = await axios.get(
          `${user.serverUrl}/api/chat/${chat_id}/getinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.status == 200) {
          setGroupName(response.data.chatName);
          setSelectedParticipants(response.data.users);
          setGroupIcon(response.data.logo);
        }
      } catch (e) {
        alert(e.response?.data?.message || "An error occurred.");
        console.log("Error in GroupForm component", e);
      }
    };
    getChatInfo();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const obj = {
      chatName: groupName,
      users: selectedParticipants.map((obj) => obj._id),
      logo: groupIcon,
    };
    try {
      const response = await axios.put(
        `${user.serverUrl}/api/chat/${chat_id}/edit`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        updateChat_id(chat_id);
        navigate(-1);
      }
    } catch (e) {
      alert(e.response?.data?.message || "An error occurred.");
      console.log("Error when editing group info");
    }
    setIsLoading(false);
  };

  // RETRIVE public id of image saved in cloudinary
  const getPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split(".")[0];
  };

  //API CALL to delete an image from cloudinary
  const deleteImage = async (imageUrl) => {
    const publicId = getPublicIdFromUrl(imageUrl);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${user.serverUrl}/api/cloudinary/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { publicId },
        }
      );
    } catch (e) {
      alert(e.response?.data?.message || "An error occurred.");
      console.error("Error deleting image:", e);
    }
  };

  // Handle file upload for group icon
  const handleFileChange = async (e) => {
    setIsLoading(true);
    if (
      groupIcon !=
      "http://res.cloudinary.com/prathamesh19/image/upload/v1738688808/cuwiwp0w86bk8vkeopgm.jpg"
    ) {
      await deleteImage(groupIcon);
    }
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

  const handleChange = (e) => {
    setGroupName(e.target.value);
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
        Edit Group Details
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
              onChange={handleChange}
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
                "Submit"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditGroup;
