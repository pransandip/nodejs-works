import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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
  CardGiftcard,
  Chat,
  Delete,
  Feed,
  Notifications,
  Search as SearchIcon,
  Settings,
} from '@mui/icons-material';
import profileImage from '../images/profile-pic.png';
import personalCardThumbnail from '../images/6-Main-_033.jpg';
import Footer from '../components/footer/index';
import CardList from '../components/CardList';
import ChatComponent from '../components/ChatComponent';
import TransitionsModal from '../components/TransitionsModal';
import Profile from '../components/Profile';
import { CustomWidthTooltip } from '../layout';
import { fetchDataApi } from '../api/services/fetchdata.service';
import FrontCardThumbnail from '../components/FrontCardThumbnail';
import BackCardThumbnail from '../components/BackCardThumbnail';
import { selectAuth } from '../redux/reducers/authSlice';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { io } from 'socket.io-client';
import { baseURL } from '../utils/axios';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 18,
  height: 18,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: 'white',
}));

const MainPage = () => {
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const [open] = useOutletContext();
  const [age, setAge] = useState('');
  const [rating, setRating] = useState(null);
  const [showCardList, setShowCardList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [personalCard, setPersonalCard] = useState({});
  const [allCards, setAllCards] = useState([]);
  const [flip, setFlip] = useState(false);
  const [chatConnectBtn, setChatConnectBtn] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const [messageNotification, setMessageNotification] = useState(0);
  const [messageNotificationCount, setMessageNotificationCount] = useState(0);
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  async function fetchPersonalCard() {
    const data = await fetchDataApi('card/personal-card');

    data && data?.data && setPersonalCard(data?.data);
  }

  async function fetchAllCards() {
    const data = await fetchDataApi('card/fetch-card');

    data && data?.data && setAllCards(data?.data);
  }

  useEffect(() => {
    fetchAllCards();
    fetchPersonalCard();
  }, []);

  useEffect(() => {
    if (auth?.user?.id) {
      const socket = io(
        `${
          process.env.REACT_APP_NODE_ENV === 'development'
            ? baseURL.local
            : baseURL.prod
        }?userId=${auth?.user?.id}`
      );
      socket.on('connect', () => {
        console.log('Connect=>', socket.id); // x8WIv7-mJelg7on_ALbx
      });
      socket.on('message', (data) => {
        setNewMessage(data);
        setMessageNotification(Math.random());
        console.log('Message=>', data); // x8WIv7-mJelg7on_ALbx
      });
      socket.on('disconnect', () => {
        console.log('Disconnect=>', socket.id); // undefined
      });
    }
  }, [auth]);
  const ownedCard =
    allCards?.length > 0
      ? allCards.filter((card) => card?.email == auth?.user?.email)
      : [];
  const followedCard =
    allCards?.length > 0
      ? allCards.filter((card) => card?.followers?.includes(auth?.user?.email))
      : [];

  return (
    <>
      {openModal && (
        <TransitionsModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          Component={() => <Profile setOpenModal={setOpenModal} />}
        />
      )}
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
          <Badge
            sx={{ position: 'absolute', bottom: 50 }}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar
              alt="Travis Howard"
              src={personalCard?.image || profileImage}
              sx={{ width: 100, height: 100 }}
            />
          </Badge>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              height: 50,
              backgroundColor: 'white',
            }}
          >
            <Box display="flex" flexDirection="column" paddingLeft={5}>
              <Typography variant="subtitle1">
                {personalCard?.title ? personalCard?.title : 'Jack Raider'}
                <IconButton
                  aria-label="delete"
                  size="medium"
                  onClick={() => setOpenModal(true)}
                >
                  <Settings fontSize="medium" />
                </IconButton>
              </Typography>
              <Typography variant="caption" marginTop="-13px">
                {auth?.user?.city || 'Sydney, Australia'}
              </Typography>
            </Box>

            <Box
              marginTop="-43px"
              gap={3}
              display="flex"
              justifyContent="center"
            >
              <CustomWidthTooltip title="Chat" placement="top">
                <IconButton
                  aria-label="delete"
                  size="medium"
                  onClick={() => {
                    // setChatConnectBtn(!chatConnectBtn);
                    setShowCardList(false);
                    setShowChat(!showChat);
                  }}
                >
                  <Badge
                    badgeContent={messageNotificationCount}
                    color="secondary"
                  >
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
                  }}
                >
                  <Badge badgeContent={allCards?.length || 0} color="secondary">
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
            </Box>
          </Box>
          <Box sx={{ position: 'absolute', right: 30, bottom: 10 }}>
            {!flip ? (
              <FrontCardThumbnail
                flip={flip}
                setFlip={setFlip}
                title={personalCard?.title || 'John Doe'}
                tagline={personalCard?.tagLine || 'Tagline text'}
                thumbnail={personalCard?.image || personalCardThumbnail}
              />
            ) : (
              <BackCardThumbnail
                flip={flip}
                setFlip={setFlip}
                title={personalCard?.title || 'John Doe'}
              />
            )}
          </Box>
        </Container>
        {!showChat && (
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
              marginTop: '30px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                width: '100%',

                backgroundColor: 'white',
                padding: 1,
              }}
              component="div"
            >
              <Paper
                style={{
                  boxShadow:
                    '0px 0px 0px -1px rgba(0,0,0,0.2), 0px 0px 0px 1px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                }}
                component="div"
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: 400,
                  height: 39,
                  marginBottom: 1,
                  marginRight: 1,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search Google Maps"
                  inputProps={{ 'aria-label': 'search google maps' }}
                />
                <IconButton
                  type="button"
                  sx={{ p: '10px' }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Age</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Rating</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={rating}
                  label="Rating"
                  onChange={handleRatingChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Container>
        )}
        {showChat && !showCardList && (
          <ChatComponent
            setMessageNotificationCount={setMessageNotificationCount}
            messageNotification={messageNotification}
            newMessage={newMessage}
          />
        )}
        {showCardList && !showChat && <CardList allCards={allCards} />}

        {!showCardList && !showChat && (
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
                marginTop: '30px',
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
                  <Typography variant="subtitle2">
                    Owned Cards{'(50)'}
                  </Typography>
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
                  {ownedCard?.length > 0 &&
                    ownedCard.map((card, index) => (
                      <Grid item xs={2} sm={4} md={3} key={index}>
                        <Card sx={{ maxWidth: 300 }}>
                          <CardActionArea
                            onClick={() =>
                              navigate(`/cards/${card?.id}`, { state: card })
                            }
                          >
                            <CardMedia
                              component="img"
                              height="200"
                              image={card?.image || personalCardThumbnail}
                              alt="green iguana"
                            />
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {card?.title || ' Lizard'}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {card?.tagLine ||
                                  `Sandy Lizards are a widespread group of squamate
                            reptiles, with over 6,000 species,`}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                          <Box display="flex" justifyContent="end">
                            <CardActions
                              onClick={() => {
                                // followCard(card?.id);
                                // setCardId(card?.id);
                              }}
                            >
                              <LoadingButton
                                // loading={cardId == card?.id && loading}
                                variant={
                                  card?.followers?.includes(
                                    auth?.user?.email
                                  ) ||
                                  (auth?.user?.followedCard &&
                                    auth?.user?.followedCard.includes(card?.id))
                                    ? 'contained'
                                    : 'outlined'
                                }
                                size="small"
                                color="secondary"
                                style={{
                                  borderRadius: '20px',
                                  textTransform: 'none',
                                }}
                              >
                                <Typography variant="caption" fontSize={12}>
                                  {card?.followers?.includes(
                                    auth?.user?.email
                                  ) ||
                                  (auth?.user?.followedCard &&
                                    auth?.user?.followedCard.includes(card?.id))
                                    ? 'following'
                                    : 'follow'}
                                </Typography>
                              </LoadingButton>
                            </CardActions>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  {/* <Grid item xs={3}>
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
                  </Grid> */}
                </Grid>
              </Box>
            </Container>
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
                marginTop: '30px',
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
                  <Typography variant="subtitle2">
                    Trending Cards{'(50)'}
                  </Typography>
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
                marginTop: '30px',
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
                  <Typography variant="subtitle2">
                    Following Cards{'(50)'}
                  </Typography>
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
                  {followedCard?.length > 0 &&
                    followedCard.map((card, index) => (
                      <Grid item xs={2} sm={4} md={3} key={index}>
                        <Card sx={{ maxWidth: 300 }}>
                          <CardActionArea
                            onClick={() =>
                              navigate(`/cards/${card?.id}`, { state: card })
                            }
                          >
                            <CardMedia
                              component="img"
                              height="200"
                              image={card?.image || personalCardThumbnail}
                              alt="green iguana"
                            />
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {card?.title || ' Lizard'}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {card?.tagLine ||
                                  `Sandy Lizards are a widespread group of squamate
                            reptiles, with over 6,000 species,`}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                          <Box display="flex" justifyContent="end">
                            <CardActions
                              onClick={() => {
                                // followCard(card?.id);
                                // setCardId(card?.id);
                              }}
                            >
                              <LoadingButton
                                // loading={cardId == card?.id && loading}
                                variant={
                                  card?.followers?.includes(
                                    auth?.user?.email
                                  ) ||
                                  (auth?.user?.followedCard &&
                                    auth?.user?.followedCard.includes(card?.id))
                                    ? 'contained'
                                    : 'outlined'
                                }
                                size="small"
                                color="secondary"
                                style={{
                                  borderRadius: '20px',
                                  textTransform: 'none',
                                }}
                              >
                                <Typography variant="caption" fontSize={12}>
                                  {card?.followers?.includes(
                                    auth?.user?.email
                                  ) ||
                                  (auth?.user?.followedCard &&
                                    auth?.user?.followedCard.includes(card?.id))
                                    ? 'following'
                                    : 'follow'}
                                </Typography>
                              </LoadingButton>
                            </CardActions>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Container>
          </>
        )}
      </Container>
    </>
  );
};

export default MainPage;
