// src/pages/Signup.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../firebase"; // your initialized firebase app

const db = getFirestore(app);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validations
    if (!email || !password || !confirmPassword)
      return setError("Please fill in all fields");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    // Disallow admin/host from signing up via UI
    const lower = email.toLowerCase();
    if (lower.includes("admin") || lower.includes("host")) {
      return setError("Admins and Hosts cannot sign up. Please login instead.");
    }

    // Perform signup
    try {
      const res = await signup(email, password);
      if (res.ok && res.user) {
        const newUser = res.user;
        const uid = newUser.uid;

        // Default role for self-signups
        const role = "user";

        // Save a simple user document in Firestore for admin listing
        await setDoc(doc(db, "users", uid), {
          uid,
          email: newUser.email,
          role,
          createdAt: new Date().toISOString(),
        });

  // After signup, if Explore passed search params, go to homestays with those params
  const search = location.search || "";
  if (search) navigate(`/homestays${search}`, { replace: true, state: { toast: "Account created successfully" } });
  else navigate("/", { replace: true });
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1500051638674-ff996a0ec29d?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 420,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(5px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth>
            Sign Up
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
