import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuItem,
  Textarea,
  ListItemDecorator,
} from '@mui/joy';

import {
  FormatBold,
  FormatItalic,
  KeyboardArrowDown,
  Check,
} from '@mui/icons-material';
import axios from '../utils/axios';
import { LoadingButton } from '@mui/lab';
import { useNotification } from '../hooks/useNotification';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CustomTextArea = ({
  keyWord,
  setReasons,
  value,
  cardId,
  postId,
  setIsSuspended,
  setIsFlagged,
  setOpenModal,
}) => {
  const { displayNotification } = useNotification();
  const navigate = useNavigate();
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState('normal');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [postReasons, setPostReasons] = React.useState({
    flag: '',
    suspend: '',
    delete: '',
  });
  const reasonObj = {
    0: 'flag',
    1: 'suspend',
    2: 'delete',
  };
  const flagCard = async (cardId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/card/flaged-card/${cardId}`);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          setIsFlagged(true);
          setLoading(false);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        }
      } else {
        console.log('error');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
      setLoading(false);
    }
  };

  const suspendCard = async (cardId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/card/suspend-card/${cardId}`);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          setIsSuspended(true);
          setLoading(false);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        }
      } else {
        console.log('error');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
      setLoading(false);
    }
  };

  const deleteCard = async (cardId) => {
    setLoading(true);
    try {
      const res = await axios.delete(`/card/delete-card/${cardId}`);
      if (res.data) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
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
          navigate('/mainpage');
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        }
      } else {
        console.log('Unexpected response:', res);
        displayNotification({
          message: 'Unexpected response from the server',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Error:', err.message || err.response?.data || err);
      displayNotification({
        message: err.message || 'An error occurred',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const flagPost = async (postId) => {
    if (!postReasons?.flag) return;
    setLoading(true);
    try {
      const res = await axios.get(`/post/flaged-post/${postId}`);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          // setIsFlagged(true);
          setLoading(false);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        }
      } else {
        console.log('error');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
      setLoading(false);
    } finally {
      setOpenModal(false);
    }
  };

  const suspendPost = async (postId) => {
    if (!postReasons?.suspend) return;
    setLoading(true);
    try {
      const res = await axios.get(`/post/suspend-post/${postId}`);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          setIsSuspended(true);
          setLoading(false);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        }
      } else {
        console.log('error');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
      setLoading(false);
    } finally {
      setOpenModal(false);
    }
  };

  const deletePost = async (postId) => {
    if (!postReasons?.delete) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/post/delete-post/${postId}`);
      if (res.data) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
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
          navigate('/mainpage');
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        }
      } else {
        console.log('Unexpected response:', res);
        displayNotification({
          message: 'Unexpected response from the server',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Error:', err.message || err.response?.data || err);
      displayNotification({
        message: err.message || 'An error occurred',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl>
      <FormLabel>Give Reason</FormLabel>
      <Textarea
        value={postReasons[keyWord]}
        autoFocus
        onChange={(e) => {
          console.log('onchange', keyWord, postReasons);
          if (value != 'post') {
            setReasons((prev) => ({
              ...prev,
              [reasonObj[value]]: e.target.value,
            }));
          }
          setPostReasons((prev) => ({
            ...prev,
            [keyWord]: e.target.value,
          }));
        }}
        placeholder="Type something here…"
        minRows={3}
        maxRows={3}
        endDecorator={
          <Box
            sx={{
              display: 'flex',
              gap: 'var(--Textarea-paddingBlock)',
              pt: 'var(--Textarea-paddingBlock)',
              borderTop: '1px solid',
              borderColor: 'divider',
              flex: 'auto',
            }}
          >
            <IconButton
              variant="plain"
              color="neutral"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <FormatBold />
              <KeyboardArrowDown fontSize="medium" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              size="sm"
              placement="bottom-start"
              sx={{ '--ListItemDecorator-size': '24px' }}
            >
              {['200', 'normal', 'bold'].map((weight) => (
                <MenuItem
                  key={weight}
                  selected={fontWeight === weight}
                  onClick={() => {
                    setFontWeight(weight);
                    setAnchorEl(null);
                  }}
                  sx={{ fontWeight: weight }}
                >
                  <ListItemDecorator>
                    {fontWeight === weight && <Check fontSize="small" />}
                  </ListItemDecorator>
                  {weight === '200' ? 'lighter' : weight}
                </MenuItem>
              ))}
            </Menu>
            <IconButton
              variant={italic ? 'soft' : 'plain'}
              color={italic ? 'primary' : 'neutral'}
              aria-pressed={italic}
              onClick={() => setItalic((bool) => !bool)}
            >
              <FormatItalic />
            </IconButton>
            <LoadingButton
              sx={{ ml: 'auto' }}
              onClick={() => {
                if (value != 'post') {
                  value == 0
                    ? flagCard(cardId)
                    : value == 1
                    ? suspendCard(cardId)
                    : deleteCard(cardId);
                } else {
                  if (keyWord == 'flag') {
                    flagPost(postId);
                  } else if (keyWord == 'suspend') {
                    suspendPost(postId);
                  } else {
                    deletePost(postId);
                  }
                }
              }}
              loading={loading}
              variant="contained"
              size="small"
              color="secondary"
              style={{
                borderRadius: '20px',
                textTransform: 'none',
                ml: 'auto',
              }}
            >
              <Typography variant="caption">Submit</Typography>
            </LoadingButton>
          </Box>
        }
        sx={{
          minWidth: 300,
          fontWeight,
          fontStyle: italic ? 'italic' : 'initial',
        }}
      />
    </FormControl>
  );
};
export default CustomTextArea;
