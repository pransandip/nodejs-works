import React, { useState } from 'react';
import {
  Container,
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
} from '@mui/material';

import { Female, Flip } from '@mui/icons-material';
import { CustomWidthTooltip } from '../layout';
import TransitionsModal from './TransitionsModal';

const BackCardThumbnail = ({ title, flip, setFlip, parent, article }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <TransitionsModal
        viewMode="article"
        open={openModal}
        handleClose={() => setOpenModal(false)}
        Component={() => <div dangerouslySetInnerHTML={{ __html: article }} />}
      />

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
        {parent !== 'cardpage' && (
          <Box position="absolute" right={5} top={5}>
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
          </Box>
        )}
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

        <Box textAlign="center" paddingRight={1} paddingLeft={1}>
          <Typography variant="subtitle1" color="#9C2486">
            Bio/History
          </Typography>
          <Typography variant="caption">
            {(
              <div
                dangerouslySetInnerHTML={{ __html: article?.slice(0, 1500) }}
              />
            ) ||
              `Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat vitae
          possimus doloremque voluptatum? Voluptatum dolore aspernatur impedit
          distinctio.`}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          onClick={() => setOpenModal(true)}
        >
          See more
        </Button>
      </Box>
    </>
  );
};

export default BackCardThumbnail;
