import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { PhotoCamera } from "@mui/icons-material";
import { userContext } from "../Context/UserState";
import { useNavigate } from "react-router-dom";

const EditUserProfile = () => {
  const user = useContext(userContext);
  const navigate = useNavigate();
  // State for form data
  const [userInfo, setUserInfo] = useState({
    username: user.userDetails.username,
    profilePicture: user.userDetails.dp,
  });

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      console.log("Error deleting image:", e);
    }
  };

  // Handle profile picture upload
  const handleFileUpload = async (e) => {
    setIsLoading(true);
    if (
      userInfo.profilePicture !=
      "http://res.cloudinary.com/prathamesh19/image/upload/v1738688808/cuwiwp0w86bk8vkeopgm.jpg"
    ) {
      deleteImage(userInfo.profilePicture);
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
    if (res.status == 200) {
      setUserInfo({ ...userInfo, profilePicture: res.data.url });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${user.serverUrl}/api/user/${user.userDetails.userId}/edit`,
        userInfo,
        {
          headers: {
            isAuthorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        user.updateUserDetails({
          username: response.data.username,
          userId: user.userDetails.userId,
          dp: response.data.dp,
        });
        navigate("/chat");
      }
      setIsLoading(false);
    } catch (e) {
      alert(e.response?.data?.message || "An error occurred.");
      console.log("Error in editing user profile");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit Profile
      </Typography>

      {/* Profile Picture Upload */}
      <Box sx={{ position: "relative", marginBottom: 3 }}>
        <Avatar
          src={userInfo.profilePicture}
          alt="Profile Picture"
          sx={{ width: 150, height: 150 }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "background.paper",
          }}
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileUpload}
          />
          <PhotoCamera />
        </IconButton>
      </Box>

      {/* Username Field */}
      <TextField
        fullWidth
        label="Username"
        name="username"
        value={userInfo.username}
        onChange={handleInputChange}
        margin="normal"
        required
        error={!userInfo.username.trim()}
        helperText={!userInfo.username.trim() ? "Username is required" : ""}
      />

      {/* Save Changes Button */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isLoading || !userInfo.username.trim()}
        sx={{ marginTop: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>
    </Box>
  );
};

export default EditUserProfile;
