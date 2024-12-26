import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  //   const handleGoBack = () => {
  //     navigate(-1); // Navigate to the previous page
  //   };

  const handleHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
        }}
      >
        <LockOutlined
          sx={{
            fontSize: 50,
            color: "#fff",
            background: "#007bb5",
            borderRadius: "50%",
            p: 1,
            mb: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#fff",
          }}
        >
          Unauthorized Access
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "#fff",
          }}
        >
          Oops! You don’t have permission to view this page.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: "#fff",
              color: "#fff",
              ":hover": {
                borderColor: "#fff",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={handleHome}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
