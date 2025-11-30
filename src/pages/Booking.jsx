import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import BackgroundWrapper from "../components/BackgroundWrapper";

export default function Bookings() {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#111";

  const handleCancel = (id) => {
    dispatch({ type: "REMOVE_BOOKING", payload: id });
    alert("Booking cancelled!");
  };

  return (
    <BackgroundWrapper type="booking">
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: textColor,
            textShadow: "1px 1px 4px rgba(0,0,0,0.35)",
          }}
        >
          Your Bookings
        </Typography>

        {(!state.bookings || state.bookings.length === 0) ? (
          <Typography
            align="center"
            sx={{
              color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "#222",
              opacity: 0.9,
              fontStyle: "italic",
            }}
          >
            You have no bookings yet.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
            }}
          >
            {state.bookings.map((b) => (
              <Card
                key={b.id}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.36)"
                      : "rgba(255,255,255,0.65)",
                  color: theme.palette.mode === "dark" ? "#fff" : "#111",
                  borderRadius: 3,
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                  p: 1,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: textColor }}>
                    {b.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "#333" }}>
                    Booked on: {new Date(b.date).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancel(b.id)}
                    sx={{
                      borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                      color: theme.palette.mode === "dark" ? "#fff" : "#111",
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    Cancel Booking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </BackgroundWrapper>
  );
}
