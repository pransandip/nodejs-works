import React, { useEffect, useState } from 'react';
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
import {
  AccountCircle,
  Email,
  PhoneEnabled,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import style from '../styles/signup.module.css';
import logo from '../images/news-logo.png';
import Footer from '../components/footer/index';
import axios from '../utils/axios';
import { getURLSearchParams } from '../utils/get.URLSearchParams';
import { useNotification } from '../hooks/useNotification';

const Signup = () => {
  const navigate = useNavigate();
  const { displayNotification } = useNotification();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: null,
    otp_verified: 'No',
  });
  const [errorMessage, setErrorMessage] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showOtpField, setShowOtpField] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validate = (name, value) => {
    const minLength = 3;
    const maxLength = 20;
    const validCharacters = /^[a-zA-Z0-9_.@-]+$/;

    switch (name) {
      case 'username':
        if (!value || value.trim() === '') {
          return 'Username is Required';
        } else if (value.length < minLength || value.length > maxLength) {
          return `Username must be between ${minLength} and ${maxLength} characters.`;
        } else if (!validCharacters.test(value)) {
          return 'Username can only contain letters, numbers, dots, underscores, hyphens, and the @ symbol.';
        } else {
          return '';
        }
      case 'email':
        if (!value) {
          return 'Email is Required';
        } else if (
          !value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        ) {
          return 'Enter a valid email address';
        } else {
          return '';
        }
      case 'phone':
        if (!value || value.trim() === '') {
          return 'Mobile number is Required';
        } else if (!value.match(/^\+\d{1,4}\d{10}$/)) {
          return 'Enter mobile number starting with ISD code';
        } else {
          return '';
        }
      case 'password':
        if (!value) {
          return 'Password is Required';
        } else if (value.length < 8 || value.length > 15) {
          return 'Password must have at least 8 character';
        } else if (!value.match(/[a-z]/g)) {
          return 'Please enter at least 1 lower character.';
        } else if (!value.match(/[A-Z]/g)) {
          return 'Please enter at least 1 upper character.';
        } else if (!value.match(/[0-9]/g)) {
          return 'Please enter at least 1 digit.';
        } else {
          return '';
        }
      case 'confirmPassword':
        if (!value) {
          return 'Confirm Password Required';
        } else if (value !== userDetails.password) {
          return 'New Password and Confirm Password Must be Same';
        } else {
          return '';
        }
      default: {
        return '';
      }
    }
  };

  // otp field validation
  useEffect(() => {
    const identifier = setTimeout(() => {
      // "checking!" it on onChange(): to show btn
      setFormIsValid(userDetails?.otp?.trim().length >= 6);
    }, 500);

    return () => {
      // "CLEAN UP"
      clearTimeout(identifier);
    };
  }, [userDetails?.otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userDetails);
    const {
      username,
      email,
      password,
      confirmPassword,
      phone,
      otp,
      otp_verified,
    } = userDetails;
    if (!username || !email || !password || !confirmPassword || !phone) {
      setErrorMessage((prev) => ({
        ...prev,
        username: validate('username', username),
      }));
      setErrorMessage((prev) => ({
        ...prev,
        email: validate('email', email),
      }));
      setErrorMessage((prev) => ({
        ...prev,
        password: validate('password', password),
      }));
      setErrorMessage((prev) => ({
        ...prev,
        confirmPassword: validate('confirmPassword', confirmPassword),
      }));
      setErrorMessage((prev) => ({
        ...prev,
        phone: validate('phone', phone),
      }));

      return;
    }
    const params = await getURLSearchParams(userDetails);
    try {
      const res = await axios.post('user/validate-signup-user', params);
      if (res) {
        if (res.status === 200 && res.data.success === '1') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
        } else if (res.status === 201) {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          setTimeout(() => {
            navigate('/moreinfo', { state: { email: userDetails?.email } });
          }, 1000);
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

  const handleUserInput = (e) => {
    setErrorMessage((prev) => ({
      ...prev,
      [e.target.name]: validate(e.target.name, e.target.value),
    }));
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  console.log({ userDetails });

  return (
    <>
      <Container className={style.login_form_container} maxWidth="xl">
        <Avatar
          alt="NewsCard Logo"
          src={logo}
          sx={{ width: 150, height: 150, marginTop: '20px' }}
        />

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
            Sign Up
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
                  Username
                </InputLabel>
                <Input
                  error={errorMessage.username ? true : false}
                  name="username"
                  onChange={(e) => handleUserInput(e)}
                  value={userDetails.username}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="username" disabled>
                        <AccountCircle />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {errorMessage.username ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errorMessage.username}
                </Typography>
              ) : (
                ''
              )}
            </Grid>

            <Grid item xs={6}>
              <FormControl
                variant="standard"
                className={style.form_control}
                sx={{ marginRight: '20px' }}
              >
                <InputLabel htmlFor="input-with-icon-adornment">
                  Email
                </InputLabel>
                <Input
                  error={errorMessage.email ? true : false}
                  name="email"
                  onChange={(e) => handleUserInput(e)}
                  value={userDetails.email}
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
              {errorMessage.email ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errorMessage.email}
                </Typography>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="standard" className={style.form_control}>
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  error={errorMessage.password ? true : false}
                  name="password"
                  onChange={(e) => handleUserInput(e)}
                  value={userDetails.password}
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
              {errorMessage.password ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errorMessage.password}
                </Typography>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="standard" className={style.form_control}>
                <InputLabel htmlFor="standard-adornment-password">
                  Confirm Password
                </InputLabel>
                <Input
                  error={errorMessage.confirmPassword ? true : false}
                  name="confirmPassword"
                  onChange={(e) => handleUserInput(e)}
                  value={userDetails.confirmPassword}
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
              {errorMessage.confirmPassword ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errorMessage.confirmPassword}
                </Typography>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl
                variant="standard"
                className={style.form_control}
                sx={{ marginRight: '20px' }}
              >
                <InputLabel htmlFor="input-with-icon-adornment">
                  Phone
                </InputLabel>
                <Input
                  error={errorMessage.phone ? true : false}
                  className={style.phoneinput}
                  name="phone"
                  onChange={(e) => handleUserInput(e)}
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
              {errorMessage.phone ? (
                <Typography variant="h6" color="red" fontSize={12}>
                  {errorMessage.phone}
                </Typography>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={6}>
              <Button
                style={{
                  padding: '6px',
                  fontSize: '0.875rem',
                  marginTop: '15px',
                }}
                variant="contained"
                onClick={handleSubmit}
                className={style.button}
              >
                Get OTP
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="standard"
                className={style.form_control}
                sx={{ marginRight: '20px' }}
              >
                <InputLabel htmlFor="input-with-icon-adornment">
                  Enter OTP
                </InputLabel>
                <Input
                  name="otp"
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      otp_verified: 'Yes',
                      [e.target.name]: e.target.value,
                    }))
                  }
                  value={userDetails.otp}
                  autoComplete="new-password"
                  id="input-with-icon-adornment"
                  type="number"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={handleSubmit}
              className={style.button}
              disabled={!formIsValid}
            >
              Sign up
            </Button>
          </Box>
          <Box textAlign="center" marginTop={1}>
            <Typography variant="caption" textAlign="center">
              Already have an account?
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/login')}
                size="small"
                sx={{ textTransform: 'none', color: '#9C2486', minWidth: 0 }}
              >
                <Typography variant="caption">Log in</Typography>
              </Button>
            </Typography>
          </Box>
        </Container>
      </Container>
      <footer style={{ marginTop: '30px' }}>
        <Footer />
      </footer>
    </>
  );
};

export default Signup;
