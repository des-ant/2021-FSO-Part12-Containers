import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { useHistory } from 'react-router-dom';

import { setNotification } from '../reducers/notificationReducer';
import { likeBlog, deleteBlog, addComment } from '../reducers/blogReducer';

const Blog = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLoggedIn = useSelector(state => state.login);
  const blogs = useSelector(state => state.blogs);

  // Find user by id matching url parameter
  const match = useRouteMatch('/blogs/:id');
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null;

  if (!blog) {
    return null;
  }

  const username = userLoggedIn ? userLoggedIn.username : null;

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog));
      dispatch(setNotification(`you liked blog ${blog.title}`));
    } catch (exception) {
      dispatch(setNotification(`${exception.response.data.error}`, 'error'));
    }
  };

  const handleRemove = async () => {
    const okToRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (okToRemove) {
      try {
        dispatch(deleteBlog(blog.id));
        dispatch(setNotification('blog deleted successfully'));
        // Redirect user to home page after deletion of blog
        history.push('/');
      } catch (exception) {
        dispatch(setNotification(`${exception.response.data.error}`, 'error'));
      }
    }
  };

  const displayComments = () => {
    if (blog.comments.length === 0) {
      return (
        <p>No comments added yet</p>
      );
    }
    return (
      <ul>
        {blog.comments.map(comment =>
          <li key={comment.id}>
            {comment.comment}
          </li>
        )}
      </ul>
    );
  };

  const handleComment = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = '';
    dispatch(addComment(blog.id, { comment }));
  };

  return (
    <div className='blog'>
      <h2>{blog.title}</h2>
      <div><a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a></div>
      <div>
        <span className='likes'>{`${blog.likes} likes`}</span>
        <button onClick={handleLike}>like</button>
      </div>
      <div>
        {`added by ${blog.user ? blog.user.name : 'No Owner'}`}
      </div>
      {blog.user && blog.user.username === username &&
        <button onClick={handleRemove}>remove</button>}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          type='text'
          name='comment'
        />
        <button type='submit'>add comment</button>
      </form>
      {displayComments()}
    </div>
  );
};

export default Blog;