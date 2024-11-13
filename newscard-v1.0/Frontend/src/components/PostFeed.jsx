import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import imageUrl from '../images/6-Main-_033.jpg';
import { Link } from 'react-router-dom';

const PostFeed = ({ posts }) => {
  return (
    <div>
      {posts.map((post, index) => (
        <Link
          to={`/post/${index}`}
          key={index}
          style={{ textDecoration: 'none' }}
          state={{ post }}
        >
          <Card key={index} variant="outlined" style={{ margin: '16px' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {post.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.timestamp}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
              <Box display="flex" justifyContent="center">
                {post.image && (
                  <img src={imageUrl} alt="Post" style={{ maxWidth: '100%' }} />
                )}
              </Box>
            </CardContent>
            <CardActions>
              <IconButton aria-label="Like">
                <ThumbUpIcon />
              </IconButton>
              <Typography>{post.likes} Likes</Typography>
            </CardActions>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default PostFeed;
