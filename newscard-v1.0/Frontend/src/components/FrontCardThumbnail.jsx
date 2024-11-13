import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
} from '@mui/material';

import { Edit, Female, Flip } from '@mui/icons-material';
import personalCardThumbnail from '../images/6-Main-_033.jpg';
import { CustomWidthTooltip } from '../layout';

const FrontCardThumbnail = ({
  cardDetails,
  title,
  tagline,
  flip,
  setFlip,
  thumbnail,
  parent,
}) => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      sx={{
        height: 380,
        width: 250,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h6" color="#9C2486">
        {title}
      </Typography>
      <Box position="absolute" right={5} top={5}>
        {parent !== 'cardpage' ? (
          <CustomWidthTooltip title="Flip" placement="right">
            <IconButton
              aria-label="flip"
              color="secondary"
              size="small"
              onClick={() => setFlip(!flip)}
            >
              <Flip fontSize="small" color="secondary" />
            </IconButton>
          </CustomWidthTooltip>
        ) : (
          <CustomWidthTooltip title="Edit" placement="right">
            <IconButton
              aria-label="edit"
              color="secondary"
              size="small"
              onClick={() =>
                navigate('/createCard', { state: { cardDetails } })
              }
            >
              <Edit fontSize="small" color="secondary" />
            </IconButton>
          </CustomWidthTooltip>
        )}
      </Box>
      <Avatar
        alt="Travis Howard"
        src={thumbnail || personalCardThumbnail}
        sx={{ width: 100, height: 100 }}
      />
      <Typography variant="body1" color="#9C2486">
        {tagline}
      </Typography>
      <Container>
        <Grid
          textAlign="center"
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {Array.from(Array(6)).map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Female fontSize="large" color="secondary" />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Button variant="text" size="small" color="secondary">
        <Typography variant="caption" color="#9C2486">
          View more
        </Typography>
      </Button>
    </Box>
  );
};

export default FrontCardThumbnail;
