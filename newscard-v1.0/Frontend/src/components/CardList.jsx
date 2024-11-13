import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  Divider,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CardActions,
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { Add } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import axios from '../utils/axios';
import personalCardThumbnail from '../images/6-Main-_033.jpg';
import { useNotification } from '../hooks/useNotification';
import { read_profile, selectAuth } from '../redux/reducers/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const CardList = ({ allCards }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { displayNotification } = useNotification();
  const auth = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const [cardId, setCardId] = useState(null);

  console.log('authuser', auth.user);

  const followCard = async (cardId) => {
    setLoading(true);
    try {
      const res = await axios.post('/card/follow-card', { cardId });
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

          let userDeatils = {
            ...auth?.user,
            followedCard:
              auth?.user?.followedcard?.length > 0
                ? [...auth.user.followedcard, cardId]
                : [cardId],
          };
          dispatch(read_profile(userDeatils));
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
  return (
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
          flexGrow: 1,
        }}
        component="div"
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle2">All Cards{'(12)'}</Typography>
        </Box>

        <Divider sx={{ marginBottom: 2 }}></Divider>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<Add />}
            color="secondary"
            size="small"
            onClick={() => navigate('/createcard')}
          >
            Create Card
          </Button>
          <FormGroup>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    color="secondary"
                    sx={{
                      color: '#9C2486',
                    }}
                  />
                }
                label="Owned Cards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="secondary"
                    sx={{
                      color: '#9C2486',
                    }}
                  />
                }
                label="Trending Cards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="secondary"
                    sx={{
                      color: '#9C2486',
                    }}
                  />
                }
                label="Followed Cards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="secondary"
                    sx={{
                      color: '#9C2486',
                    }}
                  />
                }
                label="Sample Cards"
              />
            </Box>
          </FormGroup>
        </Box>
        <Divider sx={{ marginBottom: 2, marginTop: 2 }}></Divider>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {allCards?.length > 0 &&
            allCards.map((card, index) => (
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
                      <Typography gutterBottom variant="h5" component="div">
                        {card?.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card?.tagLine}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Box display="flex" justifyContent="end">
                    <CardActions
                      onClick={() => {
                        followCard(card?.id);
                        setCardId(card?.id);
                      }}
                    >
                      <LoadingButton
                        loading={cardId == card?.id && loading}
                        variant={
                          card?.followers?.includes(auth?.user?.email) ||
                          (auth?.user?.followedCard &&
                            auth?.user?.followedCard.includes(card?.id))
                            ? 'contained'
                            : 'outlined'
                        }
                        size="small"
                        color="secondary"
                        style={{ borderRadius: '20px', textTransform: 'none' }}
                      >
                        <Typography variant="caption" fontSize={12}>
                          {card?.followers?.includes(auth?.user?.email) ||
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
  );
};

export default CardList;
