import React, { useState } from 'react';
import { Button, TextField, IconButton, Stack, Box } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/reducers/authSlice';
import { getFormData } from '../utils/formData';
import { useNotification } from '../hooks/useNotification';
import axios from '../utils/axios';

const PostBox = ({ card, setUpdateUi, updateUi }) => {
  const { displayNotification } = useNotification();
  const auth = useSelector(selectAuth);
  const [postData, setPostData] = useState({
    body: '',
    image: '',
    imageUrl: '',
  });

  const handlePostDataChange = (event) => {
    console.log('event', event.target.value);
    setPostData((prev) => ({ ...prev, body: event.target.value }));
  };

  const handlePostSubmit = async () => {
    const userDetails = { ...postData };
    userDetails.cardId = card?.id;
    userDetails.email = auth?.user?.email;
    const params = await getFormData(userDetails);
    try {
      const res = await axios.post('post/create', params);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          setPostData({ body: '', image: '', imageUrl: '' });
          setUpdateUi(!updateUi);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <TextField
        name="body"
        id="post-body"
        label="Post Text"
        multiline
        rows={4}
        value={postData.body}
        onChange={handlePostDataChange}
      />
      <input
        value={postData?.image?.fileName}
        name="image"
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={(event) => {
          const url = URL.createObjectURL(event.target.files[0]);
          setPostData((prev) => ({ ...prev, image: event.target.files[0] }));
          setPostData((prev) => ({ ...prev, imageUrl: url }));
        }}
      />
      {postData?.imageUrl && (
        <Box display="flex" justifyContent="center">
          <Box
            component="img"
            sx={{
              height: 300,
              width: 300,
            }}
            alt="personal card thumbnail"
            src={postData.imageUrl}
          />
        </Box>
      )}
      <Button variant="contained" onClick={handlePostSubmit} color="secondary">
        Post
      </Button>
    </Stack>
  );
};

export default PostBox;
