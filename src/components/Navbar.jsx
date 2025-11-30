// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Switch, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext'; // dark mode, etc.
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";

export default function Navbar(){
  const { state, dispatch } = useContext(AppContext);
  const { user, logout } = useAuth();

  // Minimal bar before login:
  if (!user) {
    return (
      <AppBar 
        position="static"
        sx={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            sx={{
              mr: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '0.5px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            🏠 Homestay Finder
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  // Full navbar after login:
  return (
    <AppBar 
      position="static"
      sx={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <IconButton 
          edge="start" 
          color="inherit" 
          sx={{
            mr: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }
          }} 
          component={RouterLink} 
          to="/"
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '0.5px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          🏠 Homestay Finder
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/homestays"
            sx={{
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
              }
            }}
          >
            Homestays
          </Button>

          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/explore"
            sx={{
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
              }
            }}
          >
            Explore
          </Button>

          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/guide"
            sx={{
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
              }
            }}
          >
            Guides
          </Button>

          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/host"
            sx={{
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
              }
            }}
          >
            Host
          </Button>

          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/booking"
            sx={{
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
              }
            }}
          >
            Bookings
          </Button>

          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/admin"
            sx={{
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
              }
            }}
          >
            Admin
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 3, gap: 1 }}>
          <Switch 
            checked={state.darkMode} 
            onChange={() => dispatch({ type: 'TOGGLE_DARK' })}
            sx={{
              '& .MuiSwitch-switchBase': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'rgba(255, 255, 255, 1)',
              },
            }}
          />

          <Typography 
            variant="body2" 
            sx={{
              ml: 1,
              mr: 1,
              fontWeight: 500,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            {user.email}
          </Typography>

          <Button 
            color="inherit" 
            onClick={logout}
            sx={{
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                borderRadius: '8px',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
