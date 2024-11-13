import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import {
  Container,
  Badge,
  Avatar,
  IconButton,
  Box,
  Paper,
  InputBase,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  Divider,
  Button,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import style from '../styles/mainpage.module.css';
import {
  Add,
  Cancel,
  CardGiftcard,
  Chat,
  Delete,
  Error,
  ErrorOutline,
  Feed,
  Female,
  Notifications,
  Search as SearchIcon,
  Settings,
} from '@mui/icons-material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import personalCardThumbnail from '../images/6-Main-_033.jpg';
import Footer from '../components/footer/index';
import CardList from '../components/CardList';
import ChatComponent from '../components/ChatComponent';
import CommentBox from '../components/CommentBox';
import CustomTab from '../components/CustomTab';
import Core from '../components/Core';
import FrontCardThumbnail from '../components/FrontCardThumbnail';
import BackCardThumbnail from '../components/BackCardThumbnail';
import CreateArticle from '../components/CreateArticle';
import PostBox from '../components/PostBox';
import PostFeed from '../components/PostFeed';
import PostDetails from '../components/PostDetails';
import { CustomWidthTooltip } from '../layout';
import { fetchDataApi } from '../api/services/fetchdata.service';
import axios from '../utils/axios';
import { selectAuth } from '../redux/reducers/authSlice';
import { useSelector } from 'react-redux';
import CommentContext from '../commentContext';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 18,
  height: 18,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: 'white',
}));

const CardPage = () => {
  const { addComment } = useContext(CommentContext);
  const [open] = useOutletContext();
  const { state } = useLocation();
  // const auth = useSelector(selectAuth);

  console.log('state', state);
  const [age, setAge] = useState('');
  const [rating, setRating] = useState(null);
  const [showCardList, setShowCardList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isCreateArticeClicked, setIsCreateArticleClicked] = useState(false);
  const [message, setMessage] = useState('');
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState('');
  const [updateUi, setUpdateUi] = useState(false);

  const [likedPostCount, setLikedPostCount] = useState({});
  const sendMessage = (event) => {
    event.preventDefault();

    // if (message) {
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
  };
  const containerRef = useRef(null);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  console.log('open', open);

  async function likePost(postId) {
    setLikedPostCount((prev) => ({
      ...prev,
      [postId]: (likedPostCount[postId] || 0) + 1,
    }));
    try {
      const res = await axios.post('post/like-post', { postId });
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          setLikedPostCount((prev) => ({
            ...prev,
            [postId]: likedPostCount[postId] - 1,
          }));
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          setUpdateUi(!updateUi);
        } else {
          console.log('error', res.data.message);
          likedPostCount[postId] &&
            setLikedPostCount((prev) => ({
              ...prev,
              [postId]: likedPostCount[postId] - 1,
            }));
        }
      } else {
        console.log('error');
        likedPostCount[postId] &&
          setLikedPostCount((prev) => ({
            ...prev,
            [postId]: likedPostCount[postId] - 1,
          }));
      }
    } catch (err) {
      console.log(err);
      likedPostCount[postId] &&
        setLikedPostCount((prev) => ({
          ...prev,
          [postId]: likedPostCount[postId] - 1,
        }));
    }
  }

  async function unLikePost(postId) {
    setLikedPostCount((prev) => ({
      ...prev,
      [postId]: (likedPostCount[postId] || 0) - 1,
    }));
    try {
      const res = await axios.post('post/un-like-post', { postId });
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          setLikedPostCount((prev) => ({
            ...prev,
            [postId]: likedPostCount[postId] + 1,
          }));
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          setUpdateUi(!updateUi);
        } else {
          console.log('error', res.data.message);
          likedPostCount[postId] &&
            setLikedPostCount((prev) => ({
              ...prev,
              [postId]: likedPostCount[postId] + 1,
            }));
        }
      } else {
        console.log('error');
        likedPostCount[postId] &&
          setLikedPostCount((prev) => ({
            ...prev,
            [postId]: likedPostCount[postId] + 1,
          }));
      }
    } catch (err) {
      console.log(err);
      likedPostCount[postId] &&
        setLikedPostCount((prev) => ({
          ...prev,
          [postId]: likedPostCount[postId] + 1,
        }));
    }
  }

  async function fetchAllPosts() {
    try {
      const res = await axios.post('post/fetch-post', { cardId: state?.id });
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          res?.data?.data && setPosts(res?.data?.data);
        } else {
          console.log('error', res.data.message);
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchPostById = async (postId) => {
    try {
      const res = await axios.post('/post/fetch-post', { postId });
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          //   id: Math.floor(Math.random() * 10000),
          // content: data,
          // createdAt: 'Just now',
          // score: 0,
          // replies: [],
          // user: { username: 'juliusomo' },
          const comments = res?.data?.data?.comments?.map((comment) => {
            console.log('commentinside', comment);
            return {
              id: comment.id,
              content: comment.body,
              createdAt: comment.createdAt,
              score: 0,
              likes: [...comment.likes],
              disLikes: [...comment.disLikes],
              replies: [...(comment.reply || '')],
              user: { username: comment.email, image: personalCardThumbnail },
              postId: comment.postId,
            };
          });
          console.log('comments', comments);
          addComment(comments);
          console.log('postData', res?.data?.data);
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

  useEffect(() => {
    fetchAllPosts();
  }, [updateUi]);

  return (
    <>
      <Container
        className={style.container}
        maxWidth="xl"
        style={{ width: open ? '83.3vw' : '94.7vw', paddingBottom: '40px' }}
      >
        <Container
          className={style.innerContainer}
          maxWidth="lg"
          sx={{
            // marginLeft: open ? '15px' : '100px',
            height: 400,
          }}
        >
          <Box sx={{ position: 'absolute', left: 30, bottom: 10 }}>
            <FrontCardThumbnail
              cardDetails={state}
              parent="cardpage"
              title={state?.title || 'John Doe'}
              tagline={state?.tagLine || 'Tagline text'}
              thumbnail={state?.image || personalCardThumbnail}
            />
          </Box>
          <Box sx={{ position: 'absolute', right: 30, bottom: 10 }}>
            <BackCardThumbnail
              parent="cardpage"
              title={state?.title || 'John Doe'}
              article={state && state?.article}
            />
          </Box>
        </Container>
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 50,
              backgroundColor: 'white',
            }}
          >
            <Box
              gap={3}
              display="flex"
              justifyContent="center"
              paddingTop="5px"
            >
              <CustomWidthTooltip title="Chat" placement="top">
                <IconButton
                  aria-label="delete"
                  size="medium"
                  onClick={() => {
                    setShowCardList(false);
                    setShowChat(!showChat);
                    setIsCreateArticleClicked(false);
                  }}
                >
                  <Badge badgeContent={4} color="secondary">
                    <Chat fontSize="medium" />
                  </Badge>
                </IconButton>
              </CustomWidthTooltip>
              <CustomWidthTooltip title="Notification" placement="top">
                <IconButton aria-label="delete" size="medium">
                  <Badge badgeContent={4} color="secondary">
                    <Notifications fontSize="medium" />
                  </Badge>
                </IconButton>
              </CustomWidthTooltip>
              <CustomWidthTooltip title="Card list" placement="top">
                <IconButton
                  aria-label="delete"
                  size="medium"
                  onClick={() => {
                    setShowChat(false);
                    setShowCardList(!showCardList);
                    setIsCreateArticleClicked(false);
                  }}
                >
                  <Badge badgeContent={4} color="secondary">
                    <Feed fontSize="medium" />
                  </Badge>
                </IconButton>
              </CustomWidthTooltip>
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
                color="secondary"
              >
                <Badge badgeContent={4} color="secondary">
                  <Typography variant="body2">Posts</Typography>
                </Badge>
              </Button>
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
                color="secondary"
              >
                <Badge badgeContent={4} color="secondary">
                  <Typography variant="body2">Followers</Typography>
                </Badge>
              </Button>
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
                color="secondary"
              >
                <Badge badgeContent={4} color="secondary">
                  <Typography variant="body2">Following</Typography>
                </Badge>
              </Button>
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
                color="secondary"
              >
                <Typography variant="body2">Direct Message</Typography>
              </Button>
              <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                color="secondary"
                onClick={() => setIsCreateArticleClicked(true)}
              >
                <Typography variant="body2">Create Article</Typography>
              </Button>
            </Box>
          </Box>
        </Container>
        {isCreateArticeClicked && (
          <Container maxWidth="lg" style={{ padding: '0 0', marginTop: 70 }}>
            <CreateArticle
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              setIsCreateArticleClicked={setIsCreateArticleClicked}
              cardId={state && state?.id}
            />
          </Container>
        )}

        {showChat && !showCardList && !isCreateArticeClicked && (
          <ChatComponent />
        )}
        {showCardList && !showChat && !isCreateArticeClicked && <CardList />}

        {!showCardList && !showChat && !isCreateArticeClicked && (
          <>
            <Container
              style={{
                padding: '0 0',
                transitionProperty: 'margin',
                transitionDuration: '0.5s',
                transitionTimingFunction: 'ease-in-out',
              }}
              maxWidth="lg"
              sx={{
                // marginLeft: open ? '15px' : '100px',
                marginTop: '70px',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'white',
                  padding: 2,
                }}
                component="div"
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">Associations</Typography>
                  <Button variant="text" size="small" color="secondary">
                    View All
                  </Button>
                </Box>

                <Divider sx={{ marginBottom: 2 }}></Divider>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
                >
                  <Grid item xs={3}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={personalCardThumbnail}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Lizard
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles,
                            with over 6,000 species, ranging across all
                            continents except Antarctica
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={personalCardThumbnail}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Lizard
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles,
                            with over 6,000 species, ranging across all
                            continents except Antarctica
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={personalCardThumbnail}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Lizard
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles,
                            with over 6,000 species, ranging across all
                            continents except Antarctica
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={personalCardThumbnail}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Lizard
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles,
                            with over 6,000 species, ranging across all
                            continents except Antarctica
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </>
        )}
        {!isCreateArticeClicked && (
          <>
            <Container maxWidth="lg" style={{ padding: '0 0', marginTop: 20 }}>
              <CustomTab
                cardId={state && state?.id}
                cardDetails={state && state}
              />
            </Container>
            {/* <Container
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

              <Core containerRef={containerRef} />
            </Container> */}
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
              <>
                <PostBox
                  card={state}
                  setUpdateUi={setUpdateUi}
                  updateUi={updateUi}
                />
              </>
              <Divider sx={{ marginBottom: 2, marginTop: 2 }}></Divider>
              <Container>
                <Box display="flex" justifyContent="space-between">
                  <h1>Posts</h1>
                  {showPostDetails && (
                    <IconButton
                      aria-label="Cancel"
                      onClick={() => setShowPostDetails(false)}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                </Box>
                <Divider sx={{ marginBottom: 2, marginTop: 2 }}></Divider>
                {!showPostDetails ? (
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                  >
                    {posts.map((post, index) => (
                      <Grid item xs={2} sm={4} md={3} key={index}>
                        <Card sx={{ maxWidth: 300 }}>
                          <CardActionArea
                            onClick={() => {
                              setShowPostDetails(true);
                              setPostId(post?.id);
                              fetchPostById(post?.id);
                            }}
                          >
                            {post?.image ? (
                              <CardMedia
                                component="img"
                                height="200"
                                image={post?.image || personalCardThumbnail}
                                alt="green iguana"
                              />
                            ) : (
                              ''
                            )}
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {post?.username || 'John Doe'}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {post?.body || 'Lizards are a widespread group'}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                          <Box display="flex" justifyContent="space-between">
                            <CardActions
                              onClick={() =>
                                !post?.likes?.length
                                  ? likePost(post?.id)
                                  : unLikePost(post?.id)
                              }
                            >
                              <IconButton
                                aria-label="Like"
                                color={
                                  post?.likes?.length ? 'secondary' : 'default'
                                }
                              >
                                <ThumbUpIcon />
                              </IconButton>
                              <Typography>
                                {`${
                                  likedPostCount[post?.id] ||
                                  post?.likes?.length
                                }`}
                              </Typography>
                            </CardActions>
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
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <PostDetails
                    post={posts.find((item) => item?.id === postId)}
                    likePost={likePost}
                    unLikePost={unLikePost}
                    likedPostCount={likedPostCount}
                  />
                )}
              </Container>

              {/* <Container
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

            <Core containerRef={containerRef} />
          </Container> */}
            </Container>
          </>
        )}
      </Container>
    </>
  );
};

export default CardPage;
