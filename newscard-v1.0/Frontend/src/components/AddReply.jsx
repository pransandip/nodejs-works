import { Avatar, Card, Stack, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import CommentContext from '../commentContext';
import theme from '../styles';
import AddReplyButton from './Reusable/Buttons/BgButtons/AddReplyButton';
import EditableReplyField from './Reusable/Reply/EditableReplyField';

const AddReply = ({ onAdd }) => {
  const { IMGOBJ } = useContext(CommentContext);
  const [replyText, setReplyText] = useState('');
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar src={IMGOBJ.juliusomo} variant="rounded" alt="user-avatar" />
          <EditableReplyField
            placeHolder="Add a reply"
            setText={setReplyText}
            text={replyText}
          />
          <Box alignSelf="center">
            <AddReplyButton
              onAdd={onAdd}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default AddReply;
