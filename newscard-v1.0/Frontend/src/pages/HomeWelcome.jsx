import React from 'react';
import VideoJS from '../components/videojs';
import image1 from '../images/home_07.jpg';
import image2 from '../images/home_09.jpg';
import image3 from '../images/home_11.jpg';
import '../styles/welcomehome.css';

import {
  Typography,
  CardMedia,
  CardContent,
  Card,
  Container,
  CardActionArea,
  Grid,
  Box,
  Button,
} from '@mui/material';
import Footer from '../components/footer/index';

const WelcomeHomePage = () => {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    // poster: videoSrc,
    sources: [
      {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };
  return (
    <>
      <Container
        maxWidth="xl"
        className="welcomehome_container"
        sx={{ marginBottom: '20vh' }}
      >
        <Box
          height={500}
          sx={{
            zIndex: -1,
            backgroundColor: 'whitesmoke',
            position: 'absolute',
            top: '90vh',
            right: 0,
            left: 0,
            bottom: 0,
            paddingBottom: '40px',
          }}
        ></Box>
        <Typography variant="h6" textAlign="center" color="white">
          Subtitle
        </Typography>
        <Typography
          variant="h3"
          textAlign="center"
          color="white"
          marginBottom={3}
        >
          SOCIAL NETWORK
        </Typography>

        <Container maxWidth="lg" sx={{ width: '70vw' }}>
          <Box padding={1} sx={{ backgroundColor: 'white' }}>
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </Box>

          <Typography
            variant="h4"
            textAlign="center"
            color="#9C2486"
            marginBottom={2}
            marginTop={4}
          >
            NewsCard
          </Typography>

          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image1}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>{' '}
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image2}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>{' '}
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image3}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
          <Box textAlign="center" marginBottom={10} marginTop={10}>
            <Button
              variant="contained"
              sx={{
                marginRight: '50px',
                backgroundColor: '#B7417D',
                padding: '10px 30px',
              }}
            >
              Learn More
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#9C2486', padding: '10px 30px' }}
            >
              Join Waitlist
            </Button>
          </Box>
        </Container>
        <footer className="footer1">
          <Footer />
        </footer>
      </Container>
    </>
  );
};

export default WelcomeHomePage;
