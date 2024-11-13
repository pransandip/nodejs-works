import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Container,
  Badge,
  Avatar,
  IconButton,
  Box,
  Paper,
  InputBase,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  Add,
  CardGiftcard,
  Chat,
  Delete,
  Feed,
  Female,
  Notifications,
  Search as SearchIcon,
  Settings,
} from '@mui/icons-material';
import style from '../styles/posts.module.css';
import ChatComponent from '../components/ChatComponent';
import Core from '../components/Core';
import PostBox from '../components/PostBox';
import PostFeed from '../components/PostFeed';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 18,
  height: 18,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: 'white',
}));

const Posts = () => {
  const [open] = useOutletContext();
  const [age, setAge] = useState('');
  const [rating, setRating] = useState(null);
  const [showCardList, setShowCardList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isCreateArticeClicked, setIsCreateArticleClicked] = useState(false);
  const [message, setMessage] = useState('');
  const sendMessage = (event) => {
    event.preventDefault();

    // if (message) {
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
  };
  const containerRef = useRef(null);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  console.log('open', open);

  const posts = [
    {
      username: 'John Doe',
      timestamp: '2 hours ago',
      content: 'Enjoying a sunny day!',
      image: 'https://example.com/some-image.jpg',
      likes: 10,
    },
    {
      username: 'John Doe',
      timestamp: '2 hours ago',
      content: 'Enjoying a sunny day!',
      image: 'https://example.com/some-image.jpg',
      likes: 10,
    },
    {
      username: 'John Doe',
      timestamp: '2 hours ago',
      content: 'Enjoying a sunny day!',
      image: 'https://example.com/some-image.jpg',
      likes: 10,
    },
    {
      username: 'John Doe',
      timestamp: '2 hours ago',
      content: 'Enjoying a sunny day!',
      image: 'https://example.com/some-image.jpg',
      likes: 10,
    },
    {
      username: 'John Doe',
      timestamp: '2 hours ago',
      content: 'Enjoying a sunny day!',
      image: 'https://example.com/some-image.jpg',
      likes: 10,
    },
    // Add more post objects as needed
  ];

  return (
    <>
      <Container
        className={style.container}
        maxWidth="xl"
        style={{ width: open ? '83.3vw' : '94.7vw', paddingBottom: '40px' }}
      >
        <Container
          ref={containerRef}
          maxWidth="lg"
          style={{
            padding: '0px 20px',
            paddingTop: '20px',
            marginTop: 20,
            backgroundColor: '#fff',

            // position: 'relative',
          }}
        >
          <>
            <PostBox />
          </>

          <Container>
            <h1>Newsfeed</h1>
            <PostFeed posts={posts} />
          </Container>

          {/* <Container
            ref={containerRef}
            maxWidth="lg"
            style={{
              padding: '0px 20px',
              marginTop: 20,
              backgroundColor: '#fff',
              height: '600px',
              overflow: 'auto',
              // position: 'relative',
            }}
          >
            <Box
              position="sticky"
              top={0}
              zIndex={999}
              sx={{ backgroundColor: 'white', paddingTop: 2 }}
            >
              <Typography variant="h5">Comments</Typography>
              <Divider style={{ marginBottom: 10 }} />
            </Box>

            <Core containerRef={containerRef} />
          </Container> */}
        </Container>
      </Container>
    </>
  );
};

export default Posts;
