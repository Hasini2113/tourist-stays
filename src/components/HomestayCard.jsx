import React from 'react';
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
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  PersonOutlineOutlined,
  FlashOn,
} from '@mui/icons-material';

export default function HomestayCard({item, onBook, id}) {
  const { rooms, amenities, rating, reviews, instant } = item;
  const image = item.image || item.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  
  return (
    <Card id={id} sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Single Image */}
      <Box sx={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%',
        height: '200px',
        backgroundColor: '#f5f5f5'
      }}>
        <img
          src={image}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          crossOrigin="anonymous"
          loading="lazy"
          onError={(e) => {
            console.log('Image failed to load:', image);
            e.target.style.display = 'none';
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', image);
          }}
        />
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
