import React, { Fragment, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  Add,
  Edit,
  Email,
  Language,
  Lock,
  PhoneEnabled,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import profileImage from '../images/profile-pic.png';
import style from '../styles/signup.module.css';
import { useNotification } from '../hooks/useNotification';
import { getFormData } from '../utils/formData';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 18,
  height: 18,
  border: `2px solid ${theme?.palette?.background?.paper}`,
  backgroundColor: 'white',
}));

const Profile = ({ setOpenModal }) => {
  const navigate = useNavigate();
  const { displayNotification } = useNotification();
  const [imageUrl, setImageUrl] = useState('');
  const [userDetails, setUserDetails] = useState({
    phone: '',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    image: '',
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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = (file && URL.createObjectURL(file)) || '';
    setUserDetails((prev) => ({
      ...prev,
      [event.target.name]: file,
    }));
    setImageUrl(url);
  };

  const updateProfile = async (id) => {
    const params = await getFormData(userDetails);
    try {
      const res = await axios.put(`/user/update`, params);
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
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Typography variant="h3" color="#9C2486">
        Profile Details
      </Typography>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <SmallAvatar
            alt="add-image-icon"
            sx={{ right: '40%', bottom: '20%' }}
          >
            <Button
              aria-label="add-image"
              color="secondary"
              size="small"
              component="label"
            >
              <Input
                name="image"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Add fontSize="small" sx={{ color: '#9C2486' }} />
            </Button>
          </SmallAvatar>
        }
      >
        <Avatar
          alt="Travis Howard"
          src={imageUrl || profileImage}
          sx={{ width: 100, height: 100 }}
        />
      </Badge>

      <Grid container rowSpacing={1}>
        <Grid item xs={12}>
          <FormControl
            variant="standard"
            className={style.form_control}
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="input-with-icon-adornment">Phone</InputLabel>
            <Input
              name="phone"
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              value={userDetails.phone}
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
        <Grid item xs={12}>
          <FormControl
            variant="standard"
            className={style.form_control}
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
            <Input
              name="newEmail"
              onChange={(e) => {
                console.log(e.target.name);
                setUserDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              value={userDetails.newEmail}
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
        <Grid item xs={12}>
          <FormControl
            variant="standard"
            className={style.form_control}
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="standard-adornment-currentpassword">
              Current Password
            </InputLabel>
            <Input
              name="currentPassword"
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              value={userDetails.currentPassword}
              id="standard-adornment-currentpassword"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            variant="standard"
            className={style.form_control}
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="standard-adornment-newpassword">
              New Password
            </InputLabel>
            <Input
              name="newPassword"
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              value={userDetails.newPassword}
              id="standard-adornment-newpassword"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            variant="standard"
            className={style.form_control}
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="standard-adornment-confirmnewpassword">
              Confirm New Password
            </InputLabel>
            <Input
              name="confirmNewPassword"
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              value={userDetails.confirmNewPassword}
              id="standard-adornment-confirmnewpassword"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            size="small"
            aria-label="user type"
            style={{ marginTop: '20px' }}
          >
            {buttons}
          </ButtonGroup>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        onClick={() => updateProfile()}
        style={{
          width: '50%',
          backgroundColor: '#9c2486',
          color: 'white',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '10px',
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Profile;
