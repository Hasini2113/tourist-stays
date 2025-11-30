import React from "react";
import useFetch from "../hooks/useFetch";
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import BackgroundWrapper from "../components/BackgroundWrapper";

export default function Guide() {
  const { data, loading, error } = useFetch("/data/attractions.json");
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#111";
  const mutedColor = theme.palette.mode === "dark" ? "rgba(255,255,255,0.85)" : "rgba(17,17,17,0.85)";

  if (loading)
    return (
      <BackgroundWrapper type="guide">
        <CircularProgress sx={{ color: "white" }} />
      </BackgroundWrapper>
    );

  if (error)
    return (
      <BackgroundWrapper type="guide">
        <Typography color="error">Failed to load guides.</Typography>
      </BackgroundWrapper>
    );

  return (
    <BackgroundWrapper type="guide">
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: "1200px",
          mx: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.18)", // keep translucency
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: textColor,
            textShadow: "2px 2px 8px rgba(0,0,0,0.45)",
            letterSpacing: "1px",
          }}
        >
          Local Attractions & Guides
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 3,
          }}
        >
          {data.map((a) => (
            <Card
              key={a.id}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.35)"
                    : "rgba(255,255,255,0.6)", // lighter in light mode for contrast
                color: mutedColor,
                borderRadius: 3,
                backdropFilter: "blur(6px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: textColor,
                    textShadow: "1px 1px 3px rgba(0,0,0,0.25)",
                  }}
                >
                  {a.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    lineHeight: 1.5,
                    color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "#222",
                  }}
                >
                  {a.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.85, color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.8)" : "#333" }}
                >
                  Distance: {a.distance} km
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </BackgroundWrapper>
  );
}
