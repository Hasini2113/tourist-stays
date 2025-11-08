import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
  Rating,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  PersonOutlineOutlined,
  FlashOn,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';

export default function HomestayCard({item, onBook, id}) {
  const { rooms, amenities, rating, reviews, instant } = item;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = item.images || [item.image];
  
  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <Card id={id} sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Image Carousel */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={images[currentImageIndex]}
          alt={`${item.title} - View ${currentImageIndex + 1}`}
          sx={{ objectFit: 'cover' }}
        />
        {images.length > 1 && (
          <>
            <IconButton
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={handlePrevImage}
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={handleNextImage}
            >
              <NavigateNext />
            </IconButton>
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                px: 1,
                borderRadius: 1,
                fontSize: '0.75rem',
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </Box>
          </>
        )}
      </Box>

      {/* Instant Book badge */}
      {instant && (
        <Chip
          icon={<FlashOn />}
          label="Instant Book"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(25, 118, 210, 0.9)',
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Title and Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {item.title}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            ₹{item.price}
          </Typography>
        </Box>

        {/* Location */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {item.location}
        </Typography>

        {/* Description */}
        <Typography variant="body2" paragraph>
          {item.description}
        </Typography>

        {/* Room Details */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BedOutlined fontSize="small" />
            <Typography variant="body2">{rooms.bedrooms} BR</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BathtubOutlined fontSize="small" />
            <Typography variant="body2">{rooms.bathrooms} BA</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonOutlineOutlined fontSize="small" />
            <Typography variant="body2">Up to {rooms.maxGuests}</Typography>
          </Box>
        </Stack>

        {/* Amenities */}
        <Box sx={{ mb: 2 }}>
          {amenities.slice(0, 3).map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
          {amenities.length > 3 && (
            <Chip
              label={`+${amenities.length - 3} more`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {/* Rating */}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary">
            {rating} ({reviews} reviews)
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onBook(item)}
          startIcon={instant && <FlashOn />}
        >
          Book Now • ₹{item.price}/night
        </Button>
      </CardActions>
    </Card>
  );
}
