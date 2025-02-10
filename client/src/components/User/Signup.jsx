import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../Context/UserState";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Signup = () => {
  let navigate = useNavigate();
  let user1 = useContext(userContext);
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    cpassword: "",
    imageUrl: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setSignupData({ ...signupData, [event.target.name]: event.target.value });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    else {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Chatify");
      formData.append("cloud_name", "prathamesh19");
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/prathamesh19/image/upload`,
        formData
      );
      if (res.status == 200)
        setSignupData({ ...signupData, imageUrl: res.data.url });
      setLoading(false);
    }
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (signupData.password !== signupData.cpassword) {
      return alert("Password does not match");
    }

    const formData = {
      username: signupData.username,
      password: signupData.password,
    };
    if (signupData.imageUrl) {
      formData.imageUrl = signupData.imageUrl;
    }
    setSignupData({
      username: "",
      password: "",
      cpassword: "",
      imageUrl: null,
    });
    setPreviewImage("");
    try {
      const response = await axios.post(
        `${user1.serverUrl}/api/user/register`,
        formData
      );

      if (response.status === 200) {
        const { token, message, user } = response.data;
        user1.updateUserDetails({
          userId: user._id,
          username: user.username,
          dp: user.dp,
        });
        localStorage.setItem("token", token);
        navigate("/chat");
        alert(message);
      }
    } catch (e) {
      alert(e.response?.data?.message || "An error occurred.");
    }
    setIsLoading(false);
  };
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            color: "#090908",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Let's Start to Connect
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#5B6372",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Please sign up to continue!
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <label htmlFor="profile-image-upload">
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Avatar
                src={previewImage}
                sx={{
                  width: 100,
                  height: 100,
                  cursor: "pointer",
                  backgroundColor: "#EC7732",
                }}
              >
                {!previewImage && loading ? (
                  <Icon path={mdiLoading} spin size={1} />
                ) : (
                  <CloudUploadIcon fontSize="large" />
                )}
              </Avatar>
            </label>
          </Box>

          <TextField
            name="username"
            label="Username"
            variant="outlined"
            size="small"
            value={signupData.username}
            onChange={handleChange}
            required
            fullWidth
            sx={{ backgroundColor: "#F7F6F4" }}
          />

          <TextField
            name="password"
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            value={signupData.password}
            onChange={handleChange}
            required
            fullWidth
            sx={{ backgroundColor: "#F7F6F4" }}
          />

          <TextField
            name="cpassword"
            label="Confirm Password"
            variant="outlined"
            size="small"
            type="password"
            value={signupData.cpassword}
            onChange={handleChange}
            required
            fullWidth
            sx={{ backgroundColor: "#F7F6F4" }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: "#EC7732",
              color: "white",
              borderRadius: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#D65F1E",
              },
            }}
          >
            {isLoading ? <Icon path={mdiLoading} spin size={1} /> : "Signup"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
