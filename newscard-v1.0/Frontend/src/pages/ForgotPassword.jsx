import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import style from '../styles/login.module.css';
import logo from '../images/news-logo.png';
import Footer from '../components/footer/index';
import { getURLSearchParams } from '../utils/get.URLSearchParams';
import axios from '../utils/axios';
import Toast from '../components/Toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassowrd, setConfirmPassword] = useState('');
  const [otp, setOTP] = useState(null);
  const [otp_verified, setOtp_verified] = useState('No');
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Username: ' + username);
    console.log('Password: ' + password);
    const params = {
      email: username,
      subject: isOtpSend ? '' : 'Reset password',
      password,
      otp_verified,
      otp,
    };
    console.log('params', params);
    try {
      setLoading(true);
      const res = await axios.post(
        isOtpSend ? 'user/forgot-password' : 'otp/send-otp',
        params
      );
      if (res.status === 200 || res.status === 201) {
        if (res.status === 200 && res.data.success === '1') {
          console.log('if', res.data.message);
          !isOtpSend && setIsOtpSend(true);
          setOpen(true);
          setType('success');
          setMessage(res?.data?.message);
        } else if (res.status === 201) {
          setOpen(true);
          setType('success');
          setMessage(res?.data?.message);
          console.log('elseif', res.data.message);
          navigate('/login');
        }
      } else {
        setOpen(true);
        setType('error');
        setMessage(res?.data?.message);
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is Required';
    } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return 'Enter a valid email address';
    } else {
      return '';
    }
  };

  return (
    <>
      <Container className={style.login_form_container} maxWidth="xl">
        <Avatar
          alt="NewsCard Logo"
          src={logo}
          sx={{ width: 150, height: 150, marginTop: '20px' }}
        />

        <Container className={style.login_form}>
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
            Reset password
          </Typography>
          {!isOtpSend && (
            <>
              <FormControl
                sx={{ width: '100%' }}
                variant="standard"
                className={style.form_control}
              >
                <InputLabel htmlFor="input-with-icon-adornment">
                  Email
                </InputLabel>
                <Input
                  error={errorMessage ? true : false}
                  onChange={(e) => {
                    setErrorMessage(validateEmail(e.target.value));
                    setUsername(e.target.value);
                  }}
                  value={username}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="email"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="email" disabled>
                        <AccountCircle />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {errorMessage ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errorMessage}
                </Typography>
              ) : (
                ''
              )}
            </>
          )}
          {isOtpSend && (
            <>
              <FormControl
                sx={{ width: '100%' }}
                variant="standard"
                className={style.form_control}
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  autoComplete="new-password"
                  id="standard-adornment-password"
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
              <FormControl
                sx={{ width: '100%' }}
                variant="standard"
                className={style.form_control}
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Confirm Password
                </InputLabel>
                <Input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassowrd}
                  autoComplete="new-password"
                  id="standard-adornment-password"
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

              <FormControl
                sx={{ width: '100%' }}
                variant="standard"
                className={style.form_control}
              >
                <InputLabel htmlFor="input-with-icon-adornment">OTP</InputLabel>
                <Input
                  onChange={(e) => {
                    setOtp_verified('Yes');
                    setOTP(e.target.value);
                  }}
                  value={otp}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="username or email" disabled>
                        <AccountCircle />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </>
          )}
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleSubmit}
            color="secondary"
            fullWidth
            // className={style.button}
          >
            {isOtpSend ? 'Reset Password' : 'Submit'}
          </LoadingButton>
        </Container>
      </Container>
      <Footer />
      <Toast
        open={open}
        message={message}
        type={type}
        handleClose={handleClose}
      />
    </>
  );
};

export default ForgotPassword;
