import React, { useContext, useState } from 'react';
import { Avatar, Card, Stack, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import CommentContext from '../commentContext';
import ScoreChanger from './ScoreChanger';
import theme from '../styles';
import RepliesSection from './RepliesSection';
import ConfirmDelete from './ConfirmDelete';
import Username from './Reusable/Username';
import CreatedAt from './Reusable/CreatedAt';
import CommentText from './Reusable/Comment/CommentText';
import EditableCommentField from './Reusable/Comment/EditableCommentField';
import EditButton from './Reusable/Buttons/TextButtons/EditButton';
import DeleteButton from './Reusable/Buttons/TextButtons/DeleteButton';
import ReplyButton from './Reusable/Buttons/TextButtons/ReplyButton';
import UpdateButton from './Reusable/Buttons/BgButtons/UpdateButton';

const Comment = ({ onPass, userList }) => {
  const { id, content, createdAt, score, replies, user } = onPass;
  const { IMGOBJ } = useContext(CommentContext);
  const userComment =
    userList?.length > 0
      ? userList?.find((item) => user.username == item?.email)
      : { username: 'username' };
  const ava = IMGOBJ[`${userComment?.username}`];

  const [clicked, setClicked] = useState(false);
  const [editingComm, setEditingComm] = useState(false);
  const [commentText, setCommentText] = useState(content);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <ConfirmDelete onOpen={openModal} onClose={handleClose} id={id} />

      <Box sx={{ p: '0 15px' }}>
        <Stack spacing={2} direction="row">
          <Box>
            <ScoreChanger onScore={score} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack spacing={2} direction="row" alignItems="center">
                <Avatar src={ava}></Avatar>
                <Username userName={userComment?.username} />
                <CreatedAt createdAt={createdAt} />
              </Stack>
              {userComment?.username === 'juliusomo' ? (
                <Stack direction="row" spacing={1}>
                  <DeleteButton functionality={() => handleOpen()} />
                  <EditButton
                    functionality={() => setEditingComm(!editingComm)}
                    editingComm={editingComm}
                  />
                </Stack>
              ) : (
                <ReplyButton functionality={() => setClicked(!clicked)} />
              )}
            </Stack>
            {editingComm ? (
              <>
                <EditableCommentField
                  commentText={commentText}
                  setCommentText={setCommentText}
                  placeHolder="Don't leave this blank!"
                />
                <UpdateButton
                  commentText={commentText}
                  editingComm={editingComm}
                  setEditingComm={setEditingComm}
                />
              </>
            ) : (
              <CommentText commentText={commentText} />
            )}
          </Box>
        </Stack>
      </Box>

      {replies ? (
        <RepliesSection
          onReplies={replies}
          onClicked={clicked}
          onTar={userComment?.username}
        />
      ) : null}
    </ThemeProvider>
  );
};
export default Comment;
