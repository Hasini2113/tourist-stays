// src/pages/Home.jsx
import React from "react";
import { Typography, Box } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        padding: 3,
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)", fontWeight: 700, color: "#FFD700" }}
        >
          Welcome to Homestay Finder
        </Typography>

        <Typography
          variant="h6"
          sx={{ maxWidth: 600, textShadow: "1px 1px 6px rgba(0,0,0,0.5)", color: "#F0F8FF" }}
        >
          Discover unique homestays, connect with locals, and experience authentic travel.
        </Typography>
      </Box>
    </Box>
  );
}
