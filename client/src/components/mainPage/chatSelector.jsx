import React from "react";
import { useState } from "react";
import { Box, Typography } from "@mui/material";

const chatSelector = () => {
  let [user, setUser] = useState([1, 2]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      {user.map((item, index) => (
        <Box
          id="chat"
          sx={{
            // border: "1px solid red",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            id="dp"
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "1px solid blue",
              marginRight: "8px",
            }}
          ></Box>
          <Box id="content" sx={{ textAlign: "left" }}>
            <Typography>
              <b>Prathamesh Darekar</b>
            </Typography>
            <Typography
              sx={{
                color: "#5B6372",
                fontSize: "12px",
              }}
            >
              Hi how are you doing!
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default chatSelector;
