import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Movie } from '@mui/icons-material';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/constants';

const TargetComplicationBox = ({ setComplications, complications = [] }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.Card,
    drop: (item, monitor) => {
      setComplications((prev) => [...prev, item?.id]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  return (
    <Box
      margin="0 auto"
      marginTop={3}
      textAlign="center"
      ref={drop}
      style={{
        backgroundColor: isOver ? '#ccc' : 'white',
        maxHeight: 600,
        overflow: 'auto',
        paddingTop: 10,
      }}
      height={300}
      width={500}
      border="1px solid #9C2486"
    >
      <Typography variant="h6" textAlign="center" color="#9C2486">
        Complications
      </Typography>
      <Grid
        textAlign="center"
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {complications?.length > 0 &&
          complications?.map((_, index) => (
            <Grid item xs={2} sm={3} md={3} key={index}>
              <Box>
                <Movie fontSize="large" color="secondary" />
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default TargetComplicationBox;
