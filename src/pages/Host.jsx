import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import BackgroundWrapper from "../components/BackgroundWrapper";

export default function Host() {
  const [form, setForm] = useState({ title: "", description: "", price: "" });

  function handleSubmit(e) {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("hosted")) || [];
    existing.push({ ...form, id: Date.now() });
    localStorage.setItem("hosted", JSON.stringify(existing));
    alert("Homestay listed!");
    setForm({ title: "", description: "", price: "" });
  }

  return (
    <BackgroundWrapper type="host">
      <Paper
        elevation={5}
        sx={{
          maxWidth: 600,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.85)", // semi-transparent
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          List your Homestay
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Price per night (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Box>
      </Paper>
    </BackgroundWrapper>
  );
}
