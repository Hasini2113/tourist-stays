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
    <BackgroundWrapper>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: "1100px",
          mx: "auto",
          backgroundColor: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(12px)",
          color: theme.palette.mode === "dark" ? "#fff" : "#111",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 3, color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
        >
          Registered Users
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography align="center">No registered users found.</Typography>
        ) : (
          <List>
            {users.map((u) => (
              <React.Fragment key={u.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {u.email || u.name || "(no email)"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Role: {u.role || "user"} • Doc ID: {u.id}
                        </Typography>
                      </Box>
                    }
                    secondary={u.createdAt ? `Signed up: ${new Date(u.createdAt).toLocaleString()}` : ""}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(u.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Note: Deleting here removes the Firestore user document only. To remove the Firebase Authentication user, use the Admin SDK / backend.
          </Typography>
        </Box>
      </Paper>
    </BackgroundWrapper>
  );
}
