// src/pages/Login.jsx
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please enter email and password");

    try {
      const res = await login(email, password);

      if (res.ok) {
        // Determine role from email (lowercase to be safe)
        const lower = email.toLowerCase();
        let role = "user";
        if (lower.includes("admin")) role = "admin";
        else if (lower.includes("host")) role = "host";

        // Save role for App routing and persistence
        // We store both simple "role" and also role_<uid> when available
        localStorage.setItem("role", role);
        if (res.user && res.user.uid) {
          localStorage.setItem(`role_${res.user.uid}`, role);
        }

        // Redirect based on role; if unauthenticated user and query params present, go to homestays with params
        const search = location.search || "";
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else if (role === "host") {
          navigate("/host", { replace: true });
        } else if (search) {
          navigate(`/homestays${search}`, { replace: true, state: { toast: "Logged in successfully" } });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        // login wrapper returned an error object
        console.error("Login wrapper error:", res);
        setError(res.message || "Login failed");
      }
    } catch (err) {
      // Firebase SDK threw — show friendly message and log details
      console.error("Firebase login error:", err);
      // err.code examples: auth/wrong-password, auth/user-not-found, auth/invalid-email
      setError(err.message || "Authentication error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
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
          p: 5,
          width: 420,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 3,
            color: "#333",
            textAlign: "center"
          }}
        >
          Login
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
            sx={{ 
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            sx={{ 
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(102, 126, 234, 0.5)",
              },
            }}
          >
            Login
          </Button>
        </form>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link 
            component={RouterLink} 
            to="/signup"
            sx={{
              textDecoration: "none",
              color: "#667eea",
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#764ba2",
                textDecoration: "underline",
              },
            }}
          >
            Sign up
          </Link>
          <Link 
            component={RouterLink} 
            to="/forgot-password"
            sx={{
              textDecoration: "none",
              color: "#667eea",
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#764ba2",
                textDecoration: "underline",
              },
            }}
          >
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
