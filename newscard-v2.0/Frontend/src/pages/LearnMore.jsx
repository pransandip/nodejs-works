import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import listImage1 from '../images/list_03.jpg';
import logo from '../images/logo.png';
import { Button, Container } from '@mui/material';
import Footer from '../components/footer/index';
import '../styles/learnmore.css';

export default function LearnMore() {
  const itemList = [
    {
      title: 'Reaching the clouds with a backpack',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
    sint quos quo deserunt fugit unde delectus similique quas
    repellat, atque quod omnis! Quibusdam similique error, numquam
    dignissimos necessitatibus fuga voluptates nesciunt illum.
    Provident eum, placeat quod quos cumque aliquid architecto?`,
    },
    {
      title: 'Reaching the clouds with a backpack',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
    sint quos quo deserunt fugit unde delectus similique quas
    repellat, atque quod omnis! Quibusdam similique error, numquam
    dignissimos necessitatibus fuga voluptates nesciunt illum.
    Provident eum, placeat quod quos cumque aliquid architecto?`,
    },
    {
      title: 'Reaching the clouds with a backpack',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
    sint quos quo deserunt fugit unde delectus similique quas
    repellat, atque quod omnis! Quibusdam similique error, numquam
    dignissimos necessitatibus fuga voluptates nesciunt illum.
    Provident eum, placeat quod quos cumque aliquid architecto?`,
    },
    {
      title: 'Reaching the clouds with a backpack',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
    sint quos quo deserunt fugit unde delectus similique quas
    repellat, atque quod omnis! Quibusdam similique error, numquam
    dignissimos necessitatibus fuga voluptates nesciunt illum.
    Provident eum, placeat quod quos cumque aliquid architecto?`,
    },
    {
      title: 'Reaching the clouds with a backpack',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
    sint quos quo deserunt fugit unde delectus similique quas
    repellat, atque quod omnis! Quibusdam similique error, numquam
    dignissimos necessitatibus fuga voluptates nesciunt illum.
    Provident eum, placeat quod quos cumque aliquid architecto?`,
    },
  ];

  return (
    <Container>
      <Box textAlign="center" marginTop={2} marginBottom={3}>
        <img src={logo} alt="logo" height={70} width={200} style={{}} />
      </Box>
      {itemList.map((item, ind) => (
        <Card
          sx={{ display: 'flex', height: 150, marginBottom: '20px' }}
          key={ind}
        >
          <CardMedia
            component="img"
            sx={{ width: 251 }}
            image={listImage1}
            alt="Live from space album cover"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                {item.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {item.description}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
      <Box textAlign="center" marginBottom={10} marginTop={10}>
        <Button
          variant="contained"
          sx={{
            marginRight: '50px',
            backgroundColor: '#B7417D',
            padding: '10px 30px',
          }}
        >
          Join Waitlist
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#9C2486', padding: '10px 30px' }}
        >
          Join Influencer List
        </Button>
      </Box>
      <footer className="footer1">
        <Footer />
      </footer>
    </Container>
  );
}
