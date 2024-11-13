import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import style from '../styles/mainpage.module.css';
import FrontCardThumbnail from '../components/FrontCardThumbnail';
import BackCardThumbnail from '../components/BackCardThumbnail';
import ComplicationList from '../components/ComplicationList';
import ComplicationBox from '../components/ComplicationBox';
import TargetComplicationBox from '../components/TargetComplicationBox';
import axios, { baseURL } from '../utils/axios';
import { getFormData } from '../utils/formData';
import { useNotification } from '../hooks/useNotification';

const CreateCard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    title,
    tagLine,
    image,
    typeOfCard,
    association,
    cardAccess,
    handle,
    id,
  } = (state && Object.keys(state)?.length > 0 && state.cardDetails) || {
    title: '',
    handle: '',
    image: '',
    typeOfCard: '',
    tagLine: '',
    association: '',
    cardAccess: '',
  };

  const { displayNotification } = useNotification();
  const [open] = useOutletContext();
  const [complications, setComplications] = useState([]);
  const [selectedFile, setSelectedFile] = useState({ name: image || '' });
  const [userDetails, setUserDetails] = useState({
    title: title || '',
    handle: handle || '',
    image: image || '',
    typeOfCard: typeOfCard || '',
    tagLine: tagLine || '',
    association: association || '',
    cardAccess: cardAccess || '',
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUserDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.files[0],
    }));
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = await getFormData(userDetails);
    try {
      const res = await axios.post('card/create', params);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
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
          setTimeout(() => {
            navigate('/mainpage');
          }, 300);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
    }
  };

  const editCard = async (id) => {
    const params = await getFormData(userDetails);
    try {
      const res = await axios.put(`card/update-card/${id}`, params);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
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
          setTimeout(() => {
            navigate('/mainpage');
          }, 300);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
    }
  };
  return (
    <Container
      className={style.container}
      maxWidth="xl"
      style={{
        width: open ? '83.3vw' : '94.7vw',
        paddingBottom: '40px',
        backgroundColor: 'pink',
      }}
    >
      <Container
        style={{
          padding: '0 0',
          transitionProperty: 'margin',
          transitionDuration: '0.5s',
          transitionTimingFunction: 'ease-in-out',
        }}
        maxWidth="lg"
      >
        <Grid container justifyContent="center">
          <Grid xs={3} item>
            <ComplicationList setComplications={setComplications} />
          </Grid>
          <Grid xs={6} item className={style.login_form}>
            <Paper
              sx={{
                height: 800,
                padding: 3,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
              }}
            >
              <Typography variant="h5" textAlign="center" color="#9C2486">
                Create Card
              </Typography>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <FormControl
                    variant="standard"
                    className={style.form_control}
                    sx={{ marginRight: '20px' }}
                  >
                    <InputLabel htmlFor="input-with-icon-adornment">
                      Title
                    </InputLabel>
                    <Input
                      name="title"
                      onChange={(e) => {
                        setUserDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                        setUserDetails((prev) => ({
                          ...prev,
                          handle: `${baseURL.local}cards/${e.target.value
                            .toLowerCase()
                            .split(' ')
                            .join('')}`,
                        }));
                      }}
                      value={userDetails.title}
                      autoComplete="new-password"
                      id="input-with-icon-adornment"
                      type="text"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    variant="standard"
                    className={style.form_control}
                    sx={{ marginRight: '20px' }}
                  >
                    <InputLabel htmlFor="input-with-icon-adornment">
                      Handle
                    </InputLabel>
                    <Input
                      name="handle"
                      onChange={(e) => {
                        console.log(e.target.name);
                        setUserDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      value={userDetails.handle}
                      autoComplete="new-password"
                      id="input-with-icon-adornment"
                      type="text"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Box className={style.uploadImage}>
                    <Input
                      readOnly
                      disabled={selectedFile?.name ? false : true}
                      value={
                        selectedFile?.name ? selectedFile?.name : 'upload image'
                      }
                    />
                    <Button
                      color="inherit"
                      aria-label="upload-image"
                      component="label"
                      style={{ minWidth: 0 }}
                    >
                      <Input
                        name="image"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <CloudUploadIcon />
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <FormControl
                    sx={{ marginTop: 1, width: '100%' }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small-label">
                      Type of Card
                    </InputLabel>
                    <Select
                      value={userDetails.typeOfCard}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      label="Type of Card"
                      name="typeOfCard"
                      onChange={(e) =>
                        setUserDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'Actor'}>Actor</MenuItem>
                      <MenuItem value={'Person'}>Person</MenuItem>
                      <MenuItem value={'Event'}>Event</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    sx={{ marginTop: 3, width: '100%' }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small-label">
                      Association
                    </InputLabel>
                    <Select
                      value={userDetails.association}
                      name="association"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      label="Association"
                      onChange={(e) =>
                        setUserDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Taylor Swift">Taylor swift</MenuItem>
                      <MenuItem value="Interstellar">Intersteller</MenuItem>
                      <MenuItem value="Joe Biden">Joe Biden</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    sx={{ marginTop: 3, width: '100%' }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small-label">
                      Card Access
                    </InputLabel>
                    <Select
                      value={userDetails.cardAccess}
                      name="cardAccess"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      label="Card Access"
                      onChange={(e) =>
                        setUserDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Public">Public</MenuItem>
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="FollowersOnly">Followers</MenuItem>
                      <MenuItem value="FollowingOnly">Following</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    variant="standard"
                    className={style.form_control}
                  >
                    <InputLabel htmlFor="standard-adornment-password">
                      Tagline
                    </InputLabel>
                    <Input
                      multiline
                      rows={2}
                      name="tagLine"
                      onChange={(e) =>
                        setUserDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      value={userDetails.tagLine}
                      id="standard-adornment-socialmedialink"
                      type="text"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  onClick={(e) =>
                    state && Object.keys(state)?.length > 0
                      ? editCard(id)
                      : handleSubmit(e)
                  }
                  className={style.button}
                >
                  {state && Object.keys(state)?.length > 0
                    ? 'Update'
                    : 'Submit'}
                </Button>
              </Box>

              <TargetComplicationBox
                complications={complications}
                setComplications={setComplications}
              />
            </Paper>
          </Grid>
          <Grid xs={3} item height={800} padding={1}>
            <Box sx={{ marginBottom: 3 }}>
              <FrontCardThumbnail />
            </Box>
            <Box>
              <BackCardThumbnail />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default CreateCard;
