import React from "react";
import axios from "axios";
import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";

const Signup = () => {
  let [signupData, setSignupData] = useState({
    username: "",
    password: "",
    cpassword: "",
  });

  let handleChange = (event) => {
    setSignupData({ ...signupData, [event.target.name]: event.target.value });
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    if (signupData.password != signupData.cpassword)
      return alert("Password does not match");
    const newData = {
      username: signupData.username,
      password: signupData.password,
    };
    setSignupData({
      username: "",
      password: "",
      cpassword: "",
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        newData
      );
      console.log(response);
    } catch (err) {
      alert(err.response.data.message);
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
          Let's
          <br /> start to connect
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
          value={signupData.username}
          onChange={handleChange}
          required
          sx={{
            marginTop: "20px;",
            backgroundColor: "#F7F6F4",
          }}
        />

        <TextField
          name="password"
          label="Password"
          varient="outlined"
          size="small"
          type="password"
          value={signupData.password}
          onChange={handleChange}
          required
          sx={{
            marginTop: "10px;",
            backgroundColor: "#F7F6F4",
          }}
        />

        <TextField
          name="cpassword"
          label="Confirm Password"
          varient="outlined"
          size="small"
          type="password"
          value={signupData.cpassword}
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
          Signup
        </Button>
      </form>
    </Container>
  );
};

export default Signup;