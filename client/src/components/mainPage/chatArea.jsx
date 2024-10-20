import React from "react";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const chatArea = () => {
  let [user, setUser] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          id="chat-header"
          sx={{
            marginBottom: "20px",
            padding: "5px 20px",
            borderBottom: "1px solid #F7F6F4",
          }}
        >
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
                Online
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box p={2} sx={{ textAlign: "left" }}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
          nesciunt dolorem deserunt nisi ratione, veniam accusamus facilis iste?
          Neque adipisci eaque incidunt expedita repudiandae quibusdam, suscipit
          odit amet ex cumque a magni consectetur ad. Sapiente id temporibus,
          quae veniam debitis laudantium. Explicabo, provident! Ut aliquam omnis
          sequi corporis autem ex corrupti obcaecati repellat esse nobis magnam,
          iure, maxime quam perspiciatis. Mollitia perspiciatis excepturi ipsa,
          esse laborum neque blanditiis iure aliquid cupiditate! Reprehenderit
          enim non dolorem tempore veniam voluptatem nisi dolores natus,
          blanditiis sit delectus facere dolore temporibus sed quibusdam numquam
          officia, quos perferendis, corrupti rerum alias maiores. Itaque,
          necessitatibus sit.
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          borderTop: "2px solid #F7F6F4",
        }}
      >
        <TextField
          name="username"
          id="standard-basic"
          variant="standard"
          placeholder="Message"
          size="medium"
          required
          sx={{
            width: "80%",
            // backgroundColor: "#F7F6F4",
            padding: "5px",
          }}
        />
        <SentimentSatisfiedOutlinedIcon color="primary" fontSize="large" />
        <AddOutlinedIcon color="primary" fontSize="large" />
        <SendIcon color="primary" fontSize="large" />
      </Box>
    </div>
  );
};

export default chatArea;
