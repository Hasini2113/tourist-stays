import React, { useMemo } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Box, Paper, Typography, CircularProgress, Button, Card, CardContent } from '@mui/material';
import { MapOutlined, OpenInNew } from '@mui/icons-material';

const defaultCenter = { lat: 15.4989, lng: 73.8278 }; // Goa center

export default function HomestayMap({ homestays, onMarkerClick }) {
  // Function to open Google Maps for a homestay
  const openGoogleMaps = (homestay) => {
    const query = encodeURIComponent(`${homestay.title} ${homestay.location}`);
    const mapsUrl = `https://www.google.com/maps/search/${query}`;
    window.open(mapsUrl, '_blank');
  };

  // Function to open all homestays in Google Maps
  const openAllHomestaysMap = () => {
    if (homestays && homestays.length > 0) {
      // Create a URL with multiple locations
      const query = encodeURIComponent('homestays in India');
      const mapsUrl = `https://www.google.com/maps/search/${query}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 'auto', 
        width: '100%', 
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <MapOutlined sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          🗺️ Explore Homestays on Google Maps
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          View all {homestays?.length || 0} homestays on Google Maps to see their exact locations
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={openAllHomestaysMap}
          endIcon={<OpenInNew />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 1.5,
            px: 4,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 30px rgba(102, 126, 234, 0.5)',
            },
          }}
        >
          View on Google Maps
        </Button>
      </Box>

      {homestays && homestays.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
            Homestay Locations:
          </Typography>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 2,
              maxHeight: '400px',
              overflowY: 'auto',
              pr: 1
            }}
          >
            {homestays.map((homestay) => (
              <Card 
                key={homestay.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  },
                }}
                onClick={() => openGoogleMaps(homestay)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {homestay.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    📍 {homestay.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ₹{homestay.price}/night
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNew />}
                    fullWidth
                    sx={{
                      color: '#667eea',
                      borderColor: '#667eea',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderColor: '#764ba2',
                        color: '#764ba2',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMaps(homestay);
                    }}
                  >
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ display: 'block', mt: 3, textAlign: 'center' }}
      >
        Click on any homestay to open its location in Google Maps
      </Typography>
    </Paper>
  );
}