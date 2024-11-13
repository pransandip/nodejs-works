import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import { Monitor, Movie, Search as SearchIcon } from '@mui/icons-material';
import ComplicationBox from './ComplicationBox';

const ComplicationList = ({ setComplications }) => {
  return (
    <Paper
      sx={{
        height: 800,
        padding: 2,

        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#ccc',
      }}
    >
      <Typography variant="h5" textAlign="center">
        Complications
      </Typography>
      <Box textAlign="center" padding={2}>
        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          color="secondary"
          size="large"
        >
          <Typography variant="body2">Create New</Typography>
        </Button>
      </Box>

      <Paper
        style={{
          boxShadow:
            '0px 0px 0px -1px rgba(0,0,0,0.2), 0px 0px 0px 1px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        }}
        component="div"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: 39,
          marginBottom: 1,
          marginRight: 1,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      <Container style={{ maxHeight: 600, overflow: 'auto', paddingTop: 10 }}>
        <Grid
          textAlign="center"
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {Array.from(Array(20)).map((_, index) => (
            <Grid item xs={2} sm={3} md={3} key={index}>
              <ComplicationBox item="" index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Paper>
  );
};

export default ComplicationList;
