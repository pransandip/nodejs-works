import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Login,
  SignUp,
  MoreInfo,
  LearnMore,
  AdminDashboard,
  MainPage,
} from './pages';
import './App.css';
import AppLayout from './layout';
import { route } from './routes/route.js';
import PrivateRoute from './routes/PrivateRoute';
import WelcomeHomePage from './pages/HomeWelcome';
import ForgotPassword from './pages/ForgotPassword';
import { jwtDecode } from 'jwt-decode';
import { read_profile, selectAuth } from './redux/reducers/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const HomeRoute =
    auth?.user?.userType != 'Regular' ? AdminDashboard : MainPage;
  const authToken = localStorage.getItem('auth-token');

  useEffect(() => {
    const token = localStorage?.getItem('auth-token')
      ? localStorage?.getItem('auth-token')
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInVzZXJuYW1lIjoiam9obi1kb2UiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MzQ5OTIyMTcsImV4cCI6MTYzNTU5NzgxN30.IhhsTnbC_BJo6jBGwzDmeUR1VhtrE6tQgS_k-J-0dfE';
    let userData = jwtDecode(token);
    dispatch(read_profile(userData));
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/moreinfo" element={<MoreInfo />} />
      <Route path="/welcomehome" element={<WelcomeHomePage />} />
      <Route path="/learnmore" element={<LearnMore />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<AppLayout />}>
          {authToken && <Route path="/" element={<HomeRoute />} />}
          {route.map((value, index) => (
            <Route
              key={index}
              path={value.path}
              element={<value.components />}
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
