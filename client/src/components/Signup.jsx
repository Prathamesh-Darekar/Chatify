import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  let [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  let handleChange = (event) => {
    setSignupData({ ...signupData, [event.target.name]: event.target.value });
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    setSignupData({
      username: "",
      email: "",
      password: "",
    });
    console.log(signupData);
    const response = await axios.post(
      "http://localhost:8080/signup",
      signupData
    );
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
          value={signupData.username}
          onChange={handleChange}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          placeholder="email"
          id="email"
          name="email"
          value={signupData.email}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="pass"
          id="password"
          name="password"
          value={signupData.password}
          onChange={handleChange}
          required
        />
        <button>Signup</button>
      </form>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Signup;
