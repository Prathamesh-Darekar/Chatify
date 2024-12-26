import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderRadius: "50%",
          width: 120,
          height: 120,
          marginBottom: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 60, color: "#ff5252" }} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        Page Not Found
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", marginBottom: 3 }}
      >
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/")}
        sx={{
          textTransform: "none",
          padding: "10px 20px",
          borderRadius: "20px",
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#005bb5",
          },
        }}
      >
        Go to Homepage
      </Button>
    </Container>
  );
};

export default PageNotFound;
