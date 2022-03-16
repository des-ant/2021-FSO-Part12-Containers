import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { Box, Typography, List, ListItem } from '@material-ui/core';

const User = () => {
  const users = useSelector(state => state.users);

  // Find user by id matching url parameter
  const match = useRouteMatch('/users/:id');
  const user = match
    ? users.find(user => user.id === match.params.id)
    : null;

  if (!user) {
    return null;
  }

  return (
    <div>
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" component="h2">{user.name}</Typography>
      </Box>
      <Box sx={{ my: 3 }}>
        <Typography variant="h5" component="h3">Added blogs</Typography>
      </Box>
      <List>
        {user.blogs.map(blog =>
          <ListItem key={blog.id}>
            <Typography variant="body1" component="span">{blog.title}</Typography>
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default User;