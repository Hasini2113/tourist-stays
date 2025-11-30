import React, { useState, useContext, useMemo, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import HomestayCard from "../components/HomestayCard";
import HomestayMap from "../components/HomestayMap";
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  TextField,
  Stack,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { Search, FilterList, Clear, Map as MapIcon } from "@mui/icons-material";

export default function Homestays() {
  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  // Context hooks
  const { dispatch } = useContext(AppContext);
  
  // Data fetching hook
  const { data, loading, error } = useFetch("/data/homestays.json");
  
  // URL parameters memo
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get('q') || '',
      checkIn: params.get('checkIn') || '',
      checkOut: params.get('checkOut') || '',
      guests: params.get('guests') || ''
    };
  }, [location.search]);

  // State hooks
  const [showMap, setShowMap] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState(urlParams.q);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [instantOnly, setInstantOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [guestCount, setGuestCount] = useState(() => {
    try {
      if (urlParams.guests) {
        const [adults = "0", children = "0"] = urlParams.guests.split(',');
        const total = Math.max(0, Number(adults) + Number(children));
        if (total > 0) {
          const options = [2, 4, 6, 8];
          const closest = options.find(opt => opt >= total) || "8";
          return String(closest);
        }
      }
    } catch (e) {
      console.warn("Failed to parse guest count:", e);
    }
    return "";
  });
  const [priceRange, setPriceRange] = useState(() => {
    if (data) {
      const prices = data.map(h => h.price);
      return [Math.min(...prices), Math.max(...prices)];
    }
    return [0, 10000];
  });

  // Update price range when data loads
  useEffect(() => {
    if (data) {
      const prices = data.map(h => h.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange([min, max]);
    }
  }, [data]);

  // Filter and sort homestays
  const filtered = useMemo(() => {
    if (!data) return [];
    let results = [...data];

    // Location/search filter (prioritize exact location match, then fallback to search)
    const search = searchTerm.toLowerCase().trim();
    if (search) {
      // First try exact location match
      const exactLocationMatches = results.filter(
        (h) => h.location.toLowerCase() === search
      );
      
      // If no exact matches, use broader search
      if (exactLocationMatches.length === 0) {
        results = results.filter(
          (h) =>
            h.title.toLowerCase().includes(search) ||
            h.location.toLowerCase().includes(search) ||
            h.description.toLowerCase().includes(search)
        );
      } else {
        results = exactLocationMatches;
      }
    }

    // Price range filter
    results = results.filter(
      (h) => h.price >= priceRange[0] && h.price <= priceRange[1]
    );

    // Guest count filter (check maxGuests)
    if (guestCount) {
      const requiredGuests = parseInt(guestCount);
      results = results.filter(
        (h) => h.rooms?.maxGuests >= requiredGuests
      );
    }

    // Date filter if provided in URL
    if (urlParams.checkIn && urlParams.checkOut) {
      const checkIn = new Date(urlParams.checkIn);
      const checkOut = new Date(urlParams.checkOut);
      
      // For now, we're not implementing actual availability checking
      // But we could filter based on booking dates if implemented
    }

    // Amenities filter (ensure all selected amenities are present)
    if (selectedAmenities.length > 0) {
      results = results.filter((h) =>
        selectedAmenities.every((amenity) => 
          h.amenities?.includes(amenity)
        )
      );
    }

    // Instant booking filter
    if (instantOnly) {
      results = results.filter((h) => h.instant === true);
    }

    // Sorting with proper fallbacks
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        results.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // "recommended" - weighted by rating and review count with proper fallbacks
        results.sort((a, b) => {
          const scoreA = (a.rating || 0) * (a.reviews || 0);
          const scoreB = (b.rating || 0) * (b.reviews || 0);
          return scoreB - scoreA;
        });
    }

    return results;
  }, [data, searchTerm, priceRange, selectedAmenities, instantOnly, guestCount, sortBy]);

  // Get all unique amenities
  const allAmenities = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.flatMap((h) => h.amenities))];
  }, [data]);

  function handleBook(item) {
    const booking = {
      ...item,
      id: Date.now(),
      date: new Date().toISOString(),
      checkIn: urlParams.checkIn,
      checkOut: urlParams.checkOut,
      guests: urlParams.guests
    };
    dispatch({ type: "ADD_BOOKING", payload: booking });
    alert("Booked: " + item.title);
  }

  function handleClearFilters() {
    setSearchTerm(urlParams.q); // Reset to URL location if any
    setPriceRange([0, 10000]);
    setSelectedAmenities([]);
    setInstantOnly(false);
    setGuestCount("");
    setSortBy("recommended");
  }

  // Effect for handling navigation toasts
  useEffect(() => {
    if (location.state && location.state.toast) {
      setSnackMsg(location.state.toast);
      setSnackSeverity(location.state.severity || "success");
      setSnackOpen(true);
      // clear the state so toast doesn't reappear on refresh/navigation
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const hasActiveFilters =
    searchTerm !== urlParams.q ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    selectedAmenities.length > 0 ||
    instantOnly ||
    guestCount ||
    sortBy !== "recommended";

  if (loading)
    return (
      <BackgroundWrapper type="homestays">
        <CircularProgress sx={{ color: "white" }} />
      </BackgroundWrapper>
    );

  if (error)
    return (
      <BackgroundWrapper type="homestays">
        <Typography color="error">Failed to load homestays.</Typography>
      </BackgroundWrapper>
    );

  return (
    <BackgroundWrapper type="homestays">
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 5,
          maxWidth: "1100px",
          mx: "auto",
          my: 3,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.25)",
          color: "#fff",
        }}
      >
        {/* 🏡 Heading */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 900,
            mb: 5,
            color: "#000",
            textShadow: "1px 1px 4px rgba(255,255,255,0.7)",
            letterSpacing: "1.2px",
          }}
        >
          Available Homestays
        </Typography>

        {/* Filters Section */}
        <Paper
          elevation={8}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <Stack spacing={3}>
            {/* Search and Sort Row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                variant="filled"
                placeholder="Search by location or homestay name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}> 
                        <Clear color="primary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  sx: {
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.6)',
                    boxShadow: '0 2px 8px rgba(31,38,135,0.08)',
                  }
                }}
                sx={{
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.6)',
                  boxShadow: '0 2px 8px rgba(31,38,135,0.08)',
                }}
              />
              <FormControl sx={{ minWidth: 200 }} variant="filled">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <MenuItem value="recommended">Recommended</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Price Range */}
            <Box>
              <Typography gutterBottom color="primary" fontWeight={600}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span role="img" aria-label="price">💸</span> Price Range (₹)
                </span>
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={500}
                sx={{
                  color: 'primary.main',
                  height: 6,
                  borderRadius: 3,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  ₹{priceRange[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  ₹{priceRange[1]}
                </Typography>
              </Box>
            </Box>

            {/* Amenities */}
            <Box>
              <Typography gutterBottom color="primary" fontWeight={600}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span role="img" aria-label="amenities">🛏️</span> Amenities
                </span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {allAmenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => {
                      if (selectedAmenities.includes(amenity)) {
                        setSelectedAmenities(
                          selectedAmenities.filter((a) => a !== amenity)
                        );
                      } else {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      }
                    }}
                    color={selectedAmenities.includes(amenity) ? "primary" : "default"}
                    sx={{
                      fontWeight: 500,
                      fontSize: 15,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: selectedAmenities.includes(amenity)
                        ? '0 2px 8px rgba(31,38,135,0.12)'
                        : 'none',
                      background: selectedAmenities.includes(amenity)
                        ? 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)'
                        : 'rgba(255,255,255,0.7)',
                      color: selectedAmenities.includes(amenity)
                        ? '#fff'
                        : 'primary.main',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Guest Count and Instant Booking */}
            <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }} variant="filled">
                <InputLabel>Guests</InputLabel>
                <Select
                  value={guestCount}
                  label="Guests"
                  onChange={(e) => setGuestCount(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="2">2+ guests</MenuItem>
                  <MenuItem value="4">4+ guests</MenuItem>
                  <MenuItem value="6">6+ guests</MenuItem>
                  <MenuItem value="8">8+ guests</MenuItem>
                </Select>
              </FormControl>
              <Chip
                icon={<FilterList />}
                label="Instant Booking"
                onClick={() => setInstantOnly(!instantOnly)}
                color={instantOnly ? "primary" : "default"}
                sx={{
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: instantOnly
                    ? 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)'
                    : 'rgba(255,255,255,0.7)',
                  color: instantOnly ? '#fff' : 'primary.main',
                  boxShadow: instantOnly ? '0 2px 8px rgba(31,38,135,0.12)' : 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              />
              {hasActiveFilters && (
                <Chip
                  icon={<Clear />}
                  label="Clear All Filters"
                  onClick={handleClearFilters}
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                    color: 'primary.main',
                    boxShadow: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                />
              )}
            </Box>
          </Stack>
        </Paper>

        {/* Results count, map toggle and date info */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography color="text.primary">
              {filtered.length} homestays found
            </Typography>
            <Paper 
              elevation={2}
              sx={{ 
                display: 'inline-flex',
                p: 0.5,
                bgcolor: 'background.paper',
                borderRadius: 2
              }}
            >
              <IconButton 
                onClick={() => setShowMap(!showMap)}
                color={showMap ? "primary" : "default"}
                title="Explore on Map"
                sx={{ 
                  bgcolor: showMap ? 'primary.light' : 'transparent',
                  '&:hover': { bgcolor: showMap ? 'primary.main' : 'grey.200' }
                }}
              >
                <MapIcon />
              </IconButton>
            </Paper>
          </Box>
          {filtered.length > 0 && urlParams.checkIn && urlParams.checkOut && (
            <Typography variant="body2" color="text.secondary">
              For {urlParams.guests ? urlParams.guests.split(',')[0] : '2'} Adults, 
              {urlParams.guests ? `, ${urlParams.guests.split(',')[1]} Children` : ''} • 
              {new Date(urlParams.checkIn).toLocaleDateString()} - {new Date(urlParams.checkOut).toLocaleDateString()}
            </Typography>
          )}
        </Box>

          {showMap ? (
            <Box sx={{ height: '70vh', mb: 4 }}>
              <HomestayMap 
                homestays={filtered} 
                onMarkerClick={(homestay) => {
                  // Scroll to the homestay card or show details
                  const element = document.getElementById(`homestay-${homestay.id}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
              />
            </Box>
          ) : filtered.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>No homestays found</Typography>
              <Typography color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: 4,
                px: 1,
              }}
            >
              {filtered.map((h) => (
                <Box
                  key={h.id}
                  sx={{
                    borderRadius: 4,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
                    backdropFilter: "blur(10px)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <HomestayCard item={h} onBook={handleBook} id={`homestay-${h.id}`} />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: "100%" }}>
            {snackMsg}
          </MuiAlert>
        </Snackbar>
      </BackgroundWrapper>
    );
}
