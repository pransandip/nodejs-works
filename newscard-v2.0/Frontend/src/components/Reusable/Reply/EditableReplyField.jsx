import { TextField } from '@mui/material';
import React from 'react';

const EditableReplyField = ({ text, setText, placeHolder }) => {
  return (
    <TextField
      multiline
      fullWidth
      minRows={2}
      maxRows={2}
      id="outlined-multilined"
      placeholder={placeHolder}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
    />
  );
};

export default EditableReplyField;
