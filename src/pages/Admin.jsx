// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // import exported db and auth

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);

    // DEBUG: print runtime Firebase info
    try {
      console.log("DEBUG window.__FIREBASE_CONFIG__:", window.__FIREBASE_CONFIG__);
      console.log("DEBUG db app projectId:", db?.app?.options?.projectId);
      console.log("DEBUG auth.currentUser:", auth?.currentUser || window.auth?.currentUser || null);
    } catch (e) {
      console.warn("DEBUG read error:", e);
    }

    const q = collection(db, "users");

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("Admin: fetched users:", list);
        setUsers(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error reading users (onSnapshot):", err);
        // show a friendly message in UI by clearing and stopping the loader
        setUsers([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this user document (Firestore)? This does NOT delete the Auth user.")) return;
    try {
      await deleteDoc(doc(db, "users", docId));
    } catch (err) {
      console.error("Failed to delete user doc:", err);
      alert("Failed to delete user document.");
    }
  };

  return (
    <BackgroundWrapper type="admin">
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 5,
          maxWidth: "1200px",
          mx: "auto",
          background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 1 }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#ffd700 60%,#1976d2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(25,118,210,0.18)",
              mr: 2
            }}>
              <span role="img" aria-label="admin" style={{ fontSize: 32 }}>👑</span>
            </Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: theme.palette.mode === "dark" ? "#fff" : "#222", letterSpacing: "1px" }}
            >
              Admin Dashboard
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ color: theme.palette.mode === "dark" ? "#eee" : "#444" }}>
            Manage registered users and roles
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : users.length === 0 ? (
          <Typography align="center">No registered users found.</Typography>
        ) : (
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 3,
            mt: 2,
          }}>
            {users.map((u) => (
              <Paper
                key={u.id}
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  position: "relative",
                  background: theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.45)"
                    : "rgba(255,255,255,0.92)",
                  boxShadow: "0 4px 24px rgba(25,118,210,0.10)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)',
                    boxShadow: '0 8px 32px rgba(25,118,210,0.18)',
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2, width: "100%" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#1976d2 60%,#ffd700 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      boxShadow: "0 2px 8px rgba(25,118,210,0.12)",
                    }}
                  >
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
                      {u.email ? u.email[0].toUpperCase() : "U"}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.mode === "dark" ? "#1976d2" : "#222" }}>
                      {u.email || u.name || "(no email)"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#eee" : "#555" }}>
                      {u.createdAt ? `Signed up: ${new Date(u.createdAt).toLocaleString()}` : ""}
                    </Typography>
                  </Box>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(u.id)}
                    sx={{ ml: 1, color: "#d32f2f", background: "rgba(255,255,255,0.7)", '&:hover': { background: "#ffd700" } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Typography variant="caption" sx={{ color: "#888" }}>Doc ID:</Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#222", fontWeight: 500 }}>{u.id}</Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Box
                    component="span"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: 13,
                      fontWeight: 600,
                      background: u.role === "admin"
                        ? "linear-gradient(90deg,#ffd700 60%,#1976d2 100%)"
                        : "linear-gradient(90deg,#1976d2 60%,#ffd700 100%)",
                      color: u.role === "admin" ? "#222" : "#fff",
                      boxShadow: "0 1px 4px rgba(25,118,210,0.10)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {u.role ? u.role.toUpperCase() : "USER"}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Note: Deleting here removes the Firestore user document only. To remove the Firebase Authentication user, use the Admin SDK / backend.
          </Typography>
        </Box>
      </Paper>
    </BackgroundWrapper>
  );
}
