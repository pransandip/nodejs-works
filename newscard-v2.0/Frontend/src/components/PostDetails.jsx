import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Container,
  Divider,
  Popover,
  MenuItem,
  SvgIcon,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import imageUrl from '../images/6-Main-_033.jpg';
import style from '../styles/posts.module.css';
import Core from './Core';
import CustomTab from './CustomTab';
import axios from '../utils/axios';
import { useNotification } from '../hooks/useNotification';
import TransitionsModal from './TransitionsModal';
import CustomTextArea from './CustomTextArea';
import { CustomWidthTooltip } from '../layout';
import { ErrorOutline } from '@mui/icons-material';
import CommentContext from '../commentContext';

const PostDetails = ({ post, likePost, likedPostCount, unLikePost }) => {
  const { addComment } = useContext(CommentContext);

  const { displayNotification } = useNotification();
  const containerRef = useRef(null);
  const [open] = useOutletContext();
  const [openPopOver, setOpenPopOver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [key, setKey] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [reasons, setReasons] = useState({
    flag: '',
    suspend: '',
    delete: '',
  });

  const handleOpenMenu = (event) => {
    setOpenPopOver(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenPopOver(null);
  };

  const handleMarkComplete = () => {
    handleCloseMenu();
    console.info('MARK COMPLETE');
  };

  const handleEdit = () => {
    handleCloseMenu();
    console.info('EDIT');
  };

  const handleDelete = () => {
    handleCloseMenu();
    console.info('DELETE');
  };

  // useEffect(() => {
  //   console.log('insideuseEffect');
  //   fetchPostById();
  // }, []);

  return (
    <>
      <TransitionsModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        Component={() => (
          <CustomTextArea
            value="post"
            postId={post?.id}
            keyWord={key}
            setIsSuspended={setIsSuspended}
            setIsFlagged={setIsFlagged}
            setReasons={setReasons}
            setOpenModal={setOpenModal}
          />
        )}
      />
      <Popover
        open={!!openPopOver}
        anchorEl={openPopOver}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setKey('flag');
            setOpenModal(true);
          }}
        >
          {/* <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 2 }} /> */}
          Flag Post
        </MenuItem>

        <MenuItem
          onClick={() => {
            setKey('suspend');
            setOpenModal(true);
          }}
        >
          {/* <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} /> */}
          Suspend Post
        </MenuItem>

        <MenuItem
          onClick={() => {
            setKey('delete');
            setOpenModal(true);
          }}
          sx={{ color: 'error.main' }}
        >
          {/* <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} /> */}
          Delete Post
        </MenuItem>
      </Popover>
      <Container
        ref={containerRef}
        maxWidth="lg"
        style={{
          padding: '0px 20px',
          paddingTop: '20px',
          marginTop: 20,
          backgroundColor: '#fff',

          // position: 'relative',
        }}
      >
        <Card
          key={post?.username}
          variant="outlined"
          style={{ margin: '16px', position: 'relative' }}
        >
          <CardContent>
            <Typography variant="h6" component="div">
              {post?.username || 'John Doe'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post?.timestamp || 'a minutes ago'}
            </Typography>
            <Typography variant="body1">
              {post?.body || 'This is the content'}
            </Typography>
            <Box position="absolute" right={10} top={10}>
              {post && post?.flaged && (
                <CustomWidthTooltip
                  title="This post is flagged"
                  placement="top"
                >
                  <IconButton>
                    <ErrorOutline color="warning" />
                  </IconButton>
                </CustomWidthTooltip>
              )}
              <IconButton edge="end" onClick={handleOpenMenu}>
                <SvgIcon>
                  <EllipsisVerticalIcon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="center" height={300}>
              {post?.image && (
                <img
                  src={post?.image || imageUrl}
                  alt="Post"
                  style={{ maxWidth: '100%' }}
                />
              )}
            </Box>
          </CardContent>

          <CardActions
            onClick={() =>
              !post?.likes?.length ? likePost(post?.id) : unLikePost(post?.id)
            }
          >
            <IconButton
              aria-label="Like"
              color={post?.likes?.length ? 'secondary' : 'default'}
            >
              <ThumbUpIcon />
            </IconButton>
            <Typography>
              {' '}
              {`${likedPostCount[post?.id] || post?.likes?.length}`}
            </Typography>
          </CardActions>
        </Card>

        <Container
          ref={containerRef}
          maxWidth="lg"
          style={{
            padding: '0px 20px',
            marginTop: 20,
            backgroundColor: '#fff',
            height: '600px',
            overflow: 'auto',
            // position: 'relative',
          }}
        >
          <Box
            position="sticky"
            top={0}
            zIndex={999}
            sx={{ backgroundColor: 'white', paddingTop: 2 }}
          >
            <Typography variant="h5">Comments</Typography>
            <Divider style={{ marginBottom: 10 }} />
          </Box>
          <Core containerRef={containerRef} postId={post?.id} />
        </Container>
      </Container>
    </>
  );
};

export default PostDetails;
