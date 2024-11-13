import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
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
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import style from '../styles/login.module.css';
import logo from '../images/news-logo.png';
import Footer from '../components/footer/index';
import { getURLSearchParams } from '../utils/get.URLSearchParams';
import axios from '../utils/axios';
import { useNotification } from '../hooks/useNotification';
import { read_profile } from '../redux/reducers/authSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { displayNotification } = useNotification();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [otp, setOTP] = useState(null);
  const [otp_verified, setOtp_verified] = useState('No');
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const validateUsername = (username) => {
    // Minimum and maximum length requirements
    const minLength = 3;
    const maxLength = 20;

    if (!username) {
      setErrors((prev) => ({
        ...prev,
        username: `Username is required.`,
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        username: ``,
      }));
      return;
    }

    // if (username.length < minLength || username.length > maxLength) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     username: `Username must be between ${minLength} and ${maxLength} characters.`,
    //   }));
    //   return;
    // }

    // // Character set (alphanumeric, underscore, dot, hyphen, and @ symbol)
    // const validCharacters = /^[a-zA-Z0-9_.@-]+$/;
    // if (!validCharacters.test(username)) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     username:
    //       'Username can only contain letters, numbers, dots, underscores, hyphens, and the @ symbol.',
    //   }));
    //   return;
    // }
  };

  const validatePassword = (value) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, password: 'Password is Required' }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
      return;
    }

    // else if (value.length < 8 || value.length > 15) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     password: 'Password must have 8 character',
    //   }));
    //   return;
    // } else if (!value.match(/[a-z]/g)) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     password: 'Please enter at least 1 lower character.',
    //   }));
    //   return;
    // } else if (!value.match(/[A-Z]/g)) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     password: 'Please enter at least 1 upper character.',
    //   }));
    //   return;
    // } else if (!value.match(/[0-9]/g)) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     password: 'Please enter at least 1 digit.',
    //   }));
    //   return;
    // }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, password });
    if (!username || !password) {
      setErrors({
        username: 'Username is Required',
        password: 'Password is Required',
      });
      return;
    }
    const params = await getURLSearchParams({
      username,
      password,
      otp_verified,
      otp,
    });
    try {
      const res = await axios.post('user/login', params);
      if (res) {
        if (res.status === 200 && res.data.success === '1') {
          console.log(res.data.message);
          setIsOtpSend(true);
          // alert(res.data.message);
          displayNotification({
            message: res.data.message,
            type: 'success',
          });
        } else if (res.status === 201) {
          console.log(res.data.message);
          let userData = jwtDecode(res?.data?.data?.token);
          dispatch(read_profile(userData));
          // console.log('userData', userData);
          localStorage.setItem('auth-token', res?.data?.data?.token);
          localStorage.setItem(
            'newscardRememberMeData',
            JSON.stringify({
              username,
              password,
              rememberMeStatus: checked,
            })
          );
          setTimeout(() => {
            navigate('/mainpage');
          }, 500);
          displayNotification({
            message: res.data.message,
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
    }
  };

  // Remember me handler
  useEffect(() => {
    const rememberMe = JSON.parse(
      localStorage.getItem('newscardRememberMeData')
    );
    if (rememberMe?.rememberMeStatus) {
      setUsername(rememberMe?.username);
      setPassword(rememberMe?.password);
      setChecked(rememberMe?.rememberMeStatus);
    } else {
      localStorage.removeItem('newscardRememberMeData');
    }
  }, []);

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
            LOG IN
          </Typography>
          {!isOtpSend && (
            <>
              <FormControl
                sx={{ width: '100%' }}
                variant="standard"
                className={style.form_control}
              >
                <InputLabel htmlFor="input-with-icon-adornment">
                  Username or Email
                </InputLabel>
                <Input
                  error={errors.username ? true : false}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    validateUsername(e.target.value);
                  }}
                  value={username}
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
              {errors.username ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errors.username}
                </Typography>
              ) : (
                ''
              )}
              <FormControl
                sx={{ width: '100%' }}
                variant="standard"
                className={style.form_control}
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  error={errors.password ? true : false}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
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
              {errors.password ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errors.password}
                </Typography>
              ) : (
                ''
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                  }
                  label={<Typography variant="caption">Remember me</Typography>}
                  sx={{ color: '#9C2486' }}
                />

                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/forgotpassword')}
                  size="small"
                  sx={{ textTransform: 'none', color: '#9C2486' }}
                >
                  <Typography variant="caption">Forgot Password?</Typography>
                </Button>
              </Box>
            </>
          )}
          {isOtpSend && (
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
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            className={style.button}
          >
            Log In
          </Button>
          {!isOtpSend && (
            <Box textAlign="center" marginTop={1}>
              <Typography variant="caption" textAlign="center">
                Does not have an account?
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/signup')}
                  size="small"
                  sx={{ textTransform: 'none', color: '#9C2486' }}
                >
                  <Typography variant="caption">Register here</Typography>
                </Button>
              </Typography>
            </Box>
          )}
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
