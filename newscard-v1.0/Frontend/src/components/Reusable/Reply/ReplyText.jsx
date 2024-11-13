import React from 'react';
import { Typography } from '@mui/material';
import Tag from './Tag';

const ReplyText = ({ repText, onTar }) => {
  return (
    <Typography
      component="div"
      sx={{ color: 'neutral.grayishBlue', p: '20px 0' }}
      fontSize="1rem"
    >
      <Tag onTar={onTar} />
      {repText}
    </Typography>
  );
};

export default ReplyText;
