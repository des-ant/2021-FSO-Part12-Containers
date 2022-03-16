import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Users from './components/Users';
import User from './components/User';
import BlogList from './components/BlogList';
import Blog from './components/Blog';

import loginService from './services/login';
import storage from './utils/storage';

import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import { loginUser, logoutUser } from './reducers/loginReducer';
import { initializeUsers } from './reducers/userReducer';

import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';

const App = () => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  useEffect(() => {
    const userLoggedIn = storage.loadUser();
    if (userLoggedIn) {
      dispatch(loginUser(userLoggedIn));
    }
  }, []);

  const userLoggedIn = useSelector(state => state.login);

  const notifyWith = (message, type='success') => {
    dispatch(setNotification(message, type, 5));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
      const userLoggedIn = await loginService.login({
        username, password,
      });
      event.target.username.value = '';
      event.target.password.value = '';
      dispatch(loginUser(userLoggedIn));
      storage.saveUser(userLoggedIn);
      notifyWith(`${userLoggedIn.name} welcome back!`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
    storage.logoutUser();
    notifyWith('logged out successfully');
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
  };

  const blogForm = () => (
    <Box sx={{ pb: 5 }}>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </Box>
  );

  if (userLoggedIn === null) {
    return (
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item md={8}>
            <Box sx={{ textAlign: 'center', m: 3 }}>
              <Typography variant="h4" component="h2">
                Log in to application
              </Typography>
            </Box>
            <Notification />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <LoginForm
                handleSubmit={handleLogin}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            <Box sx={{ position: 'relative', mx: 3 }}>
              <Typography component="em">
                {userLoggedIn.name} logged in
              </Typography>
            </Box>
            <Box flexGrow={1} textAlign='right'>
              <Button onClick={handleLogout} color="inherit" variant="outlined">
                logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Notification />

        <Grid item md={8}>
          <Box sx={{ textAlign: 'center', m: 3 }}>
            <Typography variant="h4" component="h2">Blog App</Typography>
          </Box>

          <Switch>
            <Route path="/users/:id">
              <User />
            </Route>

            <Route path="/users">
              <Users />
            </Route>

            <Route path="/blogs/:id">
              <Blog />
            </Route>

            <Route path="/">
              <Box sx={{ my: 3 }}>
                <Typography variant="h4" component="h2">Create new</Typography>
              </Box>
              {blogForm()}
              <BlogList />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;