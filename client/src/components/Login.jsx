import React from "react";
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
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        loginData
      );
      localStorage.setItem("token", response.data.token);
      alert("Login success");
    } catch (err) {
      console.log(err);
      alert("Login failed");
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
        <button>Signup</button>
      </form>
    </div>
  );
};

export default Login;
