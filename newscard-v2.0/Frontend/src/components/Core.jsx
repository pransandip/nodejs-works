import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Stack } from '@mui/material';
import Comment from './Comment';
import AddComment from './AddComment';
import CommentContext from '../commentContext';
import { fetchDataApi } from '../api/services/fetchdata.service';

const Core = ({ containerRef, postId }) => {
  const { commentSection } = useContext(CommentContext);
  const [userList, setUserList] = useState([]);

  const getUserList = async () => {
    const res = await fetchDataApi('/user/fetch-users-list');
    res && res?.data && setUserList(res?.data);
  };

  useEffect(() => {
    getUserList();
  }, []);
  return (
    <Stack spacing={3}>
      {commentSection.map((comment) => {
        return (
          <Comment key={comment.id} onPass={comment} userList={userList} />
        );
      })}
      <Box
        position="sticky"
        bottom={0}
        sx={{ backgroundColor: 'white', paddingBottom: 2 }}
      >
        <AddComment containerRef={containerRef} postId={postId} />
      </Box>
    </Stack>
  );
};

export default Core;
