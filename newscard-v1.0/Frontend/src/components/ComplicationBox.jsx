import React from 'react';
import { Box } from '@mui/material';
import { Movie } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../utils/constants';

const ComplicationBox = ({ item, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.Card,
    item: {
      id: index,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <Box ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Movie fontSize="large" color="secondary" />
    </Box>
  );
};

export default ComplicationBox;
