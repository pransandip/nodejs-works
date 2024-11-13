import { Button } from '@mui/material';
import React, { useContext } from 'react';
import CommentContext from '../../../../commentContext';
import axios from '../../../../utils/axios';

const SendButton = ({ setCommentTxt, commentTxt, containerRef, postId }) => {
  const { addComment } = useContext(CommentContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    addComment(commentTxt.trim());
    setCommentTxt('');
    const params = {
      postId,
      body: commentTxt?.trim(),
    };
    try {
      const res = await axios.post('/post/create-comment', params);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
        } else {
          console.log(res.data.message);
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button
      size="large"
      sx={{
        bgcolor: 'custom.moderateBlue',
        color: 'neutral.white',
        p: '5px 25px',
        '&:hover': {
          bgcolor: 'custom.lightGrayishBlue',
        },
      }}
      onClick={(e) => {
        !commentTxt.trim() ? e.preventDefault() : handleSubmit(e);

        console.log('containerRef', containerRef);
        // if (containerRef)
        //   containerRef.current.scrollTop =
        //     containerRef?.current?.scrollHeight + 100;
      }}
    >
      Send
    </Button>
  );
};

export default SendButton;
