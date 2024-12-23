import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();

  let [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  let handleChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    setLoginData({
      username: "",
      password: "",
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        loginData
      );
      const { token, message, user } = response.data;
      if (response.status === 200) {
        props.updateUser(user.username);
        localStorage.setItem("token", token);
        navigate("/chat");
        alert(message);
      }
    } catch (error) {
      const { status } = error;
      if (status == 404) {
        alert("Username not found!");
      } else if (status === 401) {
        alert("Invalid password!");
      } else {
        console.log(error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "25px",
            color: "#090908",
            lineHeight: "25px",
          }}
        >
          Welcome back!
        </Typography>
        <Typography
          sx={{
            color: "#5B6372",
            fontSize: "10px",
            fontWeight: "500",
            marginTop: "5px",
          }}
        >
          Please login or signup to continue!
        </Typography>
        <TextField
          name="username"
          label="Username"
          varient="outlined"
          size="small"
          value={loginData.username}
          onChange={handleChange}
          required
          sx={{
            marginTop: "20px;",
            backgroundColor: "#F7F6F4",
          }}
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          varient="outlined"
          size="small"
          value={loginData.password}
          onChange={handleChange}
          required
          sx={{
            marginTop: "10px;",
            backgroundColor: "#F7F6F4",
          }}
        />

        <Button
          variant="contained"
          type="submit"
          sx={{
            marginTop: "20px;",
            backgroundColor: "#EC7732",
            color: "white",
            borderRadius: "10px",
          }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
