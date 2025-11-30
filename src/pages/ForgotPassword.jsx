// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link as RouterLink } from "react-router-dom";

export default function ForgotPassword(){
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ ok:null, msg:"" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ok:null, msg:"" });
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ ok:true, msg: "Reset email sent. Check your mailbox (and Promotions/Spam)." });
    } catch (err) {
      setStatus({ ok:false, msg: err.message || "Failed to send reset email." });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        position: "relative",
      }}
    >
      <Paper
        sx={{
          maxWidth: 480,
          p: 4,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(5px)",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Forgot Password</Typography>
        {status.ok === true && <Alert severity="success" sx={{mb:2}}>{status.msg}</Alert>}
        {status.ok === false && <Alert severity="error" sx={{mb:2}}>{status.msg}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your registered email"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            fullWidth required sx={{mb:2}}
          />
          <Button type="submit" variant="contained" fullWidth>Send reset email</Button>
        </form>
        <Typography sx={{mt:2}}>
          Remembered? <RouterLink to="/login">Login</RouterLink>
        </Typography>
      </Paper>
    </Box>
  )
}
