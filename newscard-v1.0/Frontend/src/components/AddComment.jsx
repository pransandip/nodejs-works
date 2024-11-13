import { Avatar, Card, Stack, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import CommentContext from '../commentContext';
import theme from '../styles';
import EditableCommentField from './Reusable/Comment/EditableCommentField';
import SendButton from './Reusable/Buttons/BgButtons/SendButton';

const AddComment = ({ containerRef, postId }) => {
  const { IMGOBJ } = useContext(CommentContext);
  const [commentTxt, setCommentTxt] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: '0 15px' }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar src={IMGOBJ.juliusomo} variant="rounded" alt="user-avatar" />
          <EditableCommentField
            commentText={commentTxt}
            setCommentText={setCommentTxt}
            placeHolder="Add a comment"
          />
          <Box alignSelf="center">
            <SendButton
              postId={postId}
              commentTxt={commentTxt}
              setCommentTxt={setCommentTxt}
              containerRef={containerRef}
            />
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default AddComment;
