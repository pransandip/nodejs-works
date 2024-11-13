import { TextField } from '@mui/material';
import React from 'react';

const EditableCommentField = ({ commentText, setCommentText, placeHolder }) => {
  return (
    <TextField
      multiline
      fullWidth
      minRows={2}
      maxRows={2}
      id="outlined-multilined"
      placeholder={placeHolder}
      value={commentText}
      onChange={(e) => {
        setCommentText(e.target.value);
      }}
    />
  );
};

export default EditableCommentField;
