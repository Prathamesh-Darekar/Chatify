import React from "react";
import { useState } from "react";
import Signup from "../components/User/Signup";
import Login from "../components/User/Login";
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

const User = () => {
  const [value, setValue] = useState(0);
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
            <Login />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Signup />
          </TabPanel>
        </Box>
      </Container>
    </>
  );
};

export default User;
