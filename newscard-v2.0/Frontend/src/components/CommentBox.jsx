// src/components/CommentBox.js
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function CommentBox() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() === '') return;
    setComments([...comments, { text: comment, replies: [] }]);
    setComment('');
  };

  const handleReplySubmit = (index) => (reply) => {
    if (reply.trim() === '') return;
    const newComments = [...comments];
    newComments[index].replies.push(reply);
    setComments(newComments);
  };

  return (
    <Card style={{ borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Comments
        </Typography>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={comment}
          onChange={handleCommentChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          endIcon={<SendIcon />}
        >
          Comment
        </Button>
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemText primary={comment.text} />
              <TextField
                label="Reply"
                variant="outlined"
                fullWidth
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleReplySubmit(index)(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <IconButton
                onClick={() => handleReplySubmit(index)(comment.text)}
                color="primary"
              >
                <SendIcon />
              </IconButton>
              <List>
                {comment.replies.map((reply, replyIndex) => (
                  <ListItem key={replyIndex}>
                    <ListItemText primary={reply} />
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default CommentBox;
