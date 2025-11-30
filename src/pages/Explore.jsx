import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Avatar,
  Popover,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { CalendarMonth, ExpandMore, Add, Remove, Person } from "@mui/icons-material";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DESTINATIONS = [
  "Goa",
  "Mukteshwar",
  "Kasol",
  "Mumbai",
  "Gokarna",
  "Malvan",
  "Delhi",
  "Coonoor",
  "Jibhi",
];

export default function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(DESTINATIONS);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsAnchorEl, setGuestsAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  // helper to build search params from current form state
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (adults || children) params.set("guests", `${adults},${children}`);
    return params.toString();
  };

  const handleGuestsClick = (event) => {
    setGuestsAnchorEl(event.currentTarget);
  };

  const handleGuestsClose = () => {
    setGuestsAnchorEl(null);
  };

  const guestsOpen = Boolean(guestsAnchorEl);
  const guestsPopoverId = guestsOpen ? 'guests-popover' : undefined;

  const handleAdultsChange = (delta) => {
    const newValue = adults + delta;
    if (newValue >= 1 && newValue <= 10) {
      setAdults(newValue);
    }
  };

  const handleChildrenChange = (delta) => {
    const newValue = children + delta;
    if (newValue >= 0 && newValue <= 6) {
      setChildren(newValue);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      setResults(DESTINATIONS);
      return;
    }
    setResults(DESTINATIONS.filter((d) => d.toLowerCase().includes(q)));
  };

  const handleDestinationClick = (d) => {
    // navigate to homestays and pass all search params
    const params = new URLSearchParams();
    params.set('q', d);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (adults || children) params.set('guests', `${adults},${children}`);
    navigate(`/homestays?${params.toString()}`);
  };

  const visible = useMemo(() => results, [results]);

  return (
    <BackgroundWrapper type="explore">
      <Paper
        elevation={10}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        {/* If user is not logged in, show buttons that navigate to full auth pages */}
        {!user && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                const qs = buildSearchParams();
                navigate(`/login${qs ? `?${qs}` : ""}`);
              }}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 2,
                borderWidth: 2,
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                borderColor: '#1976d2',
                color: '#1976d2',
                backgroundColor: 'rgba(255,255,255,0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  borderColor: '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                const qs = buildSearchParams();
                navigate(`/signup${qs ? `?${qs}` : ""}`);
              }}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
                },
              }}
            >
              Sign up
            </Button>
          </Box>
        )}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Book your ideal Homestay - Villas, Apartments & more
          </Typography>

          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="City, Property Name or Location"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Check-In"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarMonth />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Check-Out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarMonth />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Guests"
                  value={`${adults} Adults${children ? `, ${children} Children` : ''}`}
                  onClick={handleGuestsClick}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <ExpandMore />
                      </InputAdornment>
                    ),
                  }}
                />
                <Popover
                  id={guestsPopoverId}
                  open={guestsOpen}
                  anchorEl={guestsAnchorEl}
                  onClose={handleGuestsClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: { width: '300px', p: 2 }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Adults</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleAdultsChange(-1)} disabled={adults <= 1}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ minWidth: '20px', textAlign: 'center' }}>{adults}</Typography>
                        <IconButton size="small" onClick={() => handleAdultsChange(1)} disabled={adults >= 10}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Children</Typography>
                        <Typography variant="caption" color="text.secondary">0-17 years old</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleChildrenChange(-1)} disabled={children <= 0}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ minWidth: '20px', textAlign: 'center' }}>{children}</Typography>
                        <IconButton size="small" onClick={() => handleChildrenChange(1)} disabled={children >= 6}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      Please provide right number of children along with their right age for best options and prices.
                    </Typography>
                  </Box>
                  <Button 
                    fullWidth
                    variant="contained"
                    onClick={handleGuestsClose}
                    startIcon={<Person />}
                  >
                    APPLY
                  </Button>
                </Popover>
              </Grid>
              <Grid item xs={6} md={1} sx={{ display: "flex", alignItems: "center" }}>
                <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSearch}>
                  SEARCH
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Popular Destinations
          </Typography>

          <Grid container spacing={3}>
            {visible.length === 0 ? (
              <Grid item xs={12}>
                <Typography align="center">No destinations match your search.</Typography>
              </Grid>
            ) : (
              visible.map((d) => (
                <Grid key={d} item xs={12} sm={6} md={4}>
                  <Paper
                    elevation={4}
                    onClick={() => handleDestinationClick(d)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: 3,
                      borderRadius: 3,
                      cursor: "pointer",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      textAlign: "center",
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                        backgroundColor: "rgba(255,255,255,0.8)",
                      },
                    }}
                  >
                    <Avatar sx={{ 
                      width: 72, 
                      height: 72,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '2rem',
                      fontWeight: 700
                    }}>
                      {d.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                        {d}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Homestays - Villas & Apts
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Paper>
    </BackgroundWrapper>
  );
}
