// src/components/BackgroundWrapper.jsx
import React from "react";
import { Box } from "@mui/material";

const backgroundImages = {
  home: "https://images.unsplash.com/photo-1571508601633-de0aa8f75a87?w=1920&q=80",
  explore: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  homestays: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80",
  booking: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
  guide: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
  admin: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
  host: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80",
  default: "https://images.unsplash.com/photo-1501785888041-af3ee9c470a0?w=1920&q=80",
};

export default function BackgroundWrapper({ children, type = "default" }) {
  const backgroundImage = backgroundImages[type] || backgroundImages.default;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: "white",
        textAlign: "center",
        p: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
}
