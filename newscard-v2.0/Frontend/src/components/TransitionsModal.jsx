import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #9c2486',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({
  open,
  handleClose,
  Component,
  viewMode,
}) {
  return (
    <div>
      <Modal
        style={{
          position: 'absolute',
          top: '10%',
          overflow: 'scroll',
          height: '100%',
          display: 'block',
        }}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={!viewMode ? style : { ...style, width: 800, overflow: 'auto' }}
          >
            <Component />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
