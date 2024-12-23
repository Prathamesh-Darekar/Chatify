import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import { Container, Box, Tab, Tabs, Typography } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const User = (props) => {
  const [value, setValue] = useState(0);
  console.log("hi");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Container
        maxWidth="500px"
        sx={{
          maxWidth: "500px",
          backgroundColor: "#FEFFFF",
          padding: "25px 0",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Login" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Signup" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TabPanel value={value} index={0}>
            <Login updateUser={props.updateUser} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Signup updateUser={props.updateUser} />
          </TabPanel>
        </Box>
        <Link to="/chat">Chat</Link>
      </Container>
    </>
  );
};

export default User;
