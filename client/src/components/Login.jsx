import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Login = () => {
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
      const { status } = response;
      if (status === 200) {
        alert("Login Successful!");
      }
    } catch (error) {
      const { status } = error;
      console.log(error);
      if (status == 404) {
        alert("Username not found!");
      } else if (status === 401) {
        alert("Invalid password!");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="pass"
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          required
        />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
