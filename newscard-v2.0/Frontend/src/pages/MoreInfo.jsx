import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Avatar,
  Box,
  Typography,
  FormGroup,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Input,
  TextareaAutosize,
  ButtonGroup,
} from '@mui/material';
import {
  AccountCircle,
  Email,
  PhoneEnabled,
  Visibility,
  VisibilityOff,
  CloudUpload as CloudUploadIcon,
  Language,
  Edit,
} from '@mui/icons-material';
import style from '../styles/signup.module.css';
import Footer from '../components/footer/index';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { getFormData } from '../utils/formData';

const MoreInfo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    firstname: '',
    lastname: '',
    city: '',
    image: '',
    link: '',
    bio: '',
    userType: '',
  });

  const [selectedUserType, setSelectedUserType] = useState(0);

  const buttons = [
    <Button
      key={1}
      sx={{ paddingRight: '50px', paddingLeft: '50px' }}
      variant={selectedUserType === 1 ? 'contained' : 'outlined'}
      color="secondary"
      onClick={() => {
        setSelectedUserType(1);
        setUserDetails((prev) => ({ ...prev, userType: 'Regular' }));
      }}
    >
      Reagular User
    </Button>,
    <Button
      key={2}
      sx={{ paddingRight: '50px', paddingLeft: '50px' }}
      color="secondary"
      variant={selectedUserType === 2 ? 'contained' : 'outlined'}
      onClick={() => {
        setSelectedUserType(2);
        setUserDetails((prev) => ({ ...prev, userType: 'Mode' }));
      }}
    >
      Mode User
    </Button>,
  ];

  const [selectedFile, setSelectedFile] = useState({ name: '' });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUserDetails((prev) => ({
      ...prev,
      [event.target.name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userDetails);
    const params = await getFormData({ ...userDetails, ...state });
    try {
      const res = await axios.post('user/signup', params);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          alert(res.data.message);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(state);
  console.log(userDetails);

  return (
    <>
      <Container className={style.login_form_container} maxWidth="xl">
        <Typography variant="h5" textAlign="center" color="white" marginTop={2}>
          NewsCard
        </Typography>
        <Container className={style.login_form} maxWidth="sm">
          <Box textAlign="center">
            <AccountCircle
              sx={{
                color: '#9C2486',
                height: 70,
                width: 70,
              }}
            />
          </Box>
          <Typography variant="h5" textAlign="center" color="#9C2486">
            Other Information
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
                  First Name
                </InputLabel>
                <Input
                  name="firstname"
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  value={userDetails.firstName}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="phone" disabled>
                        <PhoneEnabled />
                      </IconButton>
                    </InputAdornment>
                  }
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
                  Last Name
                </InputLabel>
                <Input
                  name="lastname"
                  onChange={(e) => {
                    console.log(e.target.name);
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                  value={userDetails.lastName}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="email"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="email" disabled>
                        <Email />
                      </IconButton>
                    </InputAdornment>
                  }
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
                  City
                </InputLabel>
                <Input
                  name="city"
                  onChange={(e) => {
                    console.log(e.target.name);
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                  value={userDetails.city}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="email"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="email" disabled>
                        <Email />
                      </IconButton>
                    </InputAdornment>
                  }
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
            <Grid item xs={6} marginTop={3}>
              <FormControl variant="standard" className={style.form_control}>
                <InputLabel htmlFor="standard-adornment-password">
                  social media or website link
                </InputLabel>
                <Input
                  multiline
                  rows={2}
                  name="link"
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  value={userDetails.socialLink}
                  id="standard-adornment-socialmedialink"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="phone" disabled>
                        <Language />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="standard" className={style.form_control}>
                <InputLabel htmlFor="standard-adornment-password">
                  Bio
                </InputLabel>
                <Input
                  multiline
                  rows={3}
                  name="bio"
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  value={userDetails.bio}
                  id="standard-adornment-socialmedialink"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="phone" disabled>
                        <Edit fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
              <InputLabel htmlFor="standard-adornment-password">
                Select User Type
              </InputLabel>

              <ButtonGroup
                size="medium"
                aria-label="user type"
                style={{ marginTop: '20px' }}
              >
                {buttons}
              </ButtonGroup>
            </Grid>
          </Grid>
          <Box textAlign="center" marginTop={2}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              className={style.button}
            >
              Submit
            </Button>
          </Box>
        </Container>
      </Container>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default MoreInfo;
