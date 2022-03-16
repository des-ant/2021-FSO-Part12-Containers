import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

// Sort blogs by number of likes in descending order
const byLikes = (b1, b2) => b2.likes - b1.likes;

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data.sort(byLikes);
    case 'CREATE_BLOG':
      return [...state, action.data];
    case 'LIKE_BLOG': {
      const liked = action.data;
      // Create new list of blogs, updating the blog that was liked
      return state.map(b => b.id === liked.id ? liked : b).sort(byLikes);
    }
    case 'DELETE_BLOG': {
      const id = action.id;
      // Create new list of blogs without the deleted blog
      return state.filter(b => b.id !== id);
    }
    case 'ADD_COMMENT_TO_BLOG': {
      const comment = action.data;
      const id = action.id;
      // Create new list of blogs, updating the blog with the new comment
      return state.map(b => b.id === id
        ? { ...b, comments: [...b.comments, comment] }
        : b)
        .sort(byLikes);
    }
    default:
      return state;
  }
};

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data,
    });
  };
};

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const data = await blogService.create(blog);
      dispatch({
        type: 'CREATE_BLOG',
        data,
      });
      dispatch(setNotification(`a new blog ${blog.title} by ${blog.author} added`));
    } catch (exception) {
      dispatch(setNotification(`${exception.response.data.error}`, 'error'));
    }
  };
};

export const likeBlog = (blog) => {
  return async dispatch => {
    const toLike = { ...blog, likes: blog.likes + 1 };
    const data = await blogService.update(toLike);
    dispatch({
      type: 'LIKE_BLOG',
      data,
    });
  };
};

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id);
    dispatch({
      type: 'DELETE_BLOG',
      id,
    });
  };
};

export const addComment = (id, comment) => {
  return async dispatch => {
    try {
      const data = await blogService.addComment(id, comment);
      dispatch({
        type: 'ADD_COMMENT_TO_BLOG',
        data,
        id,
      });
      dispatch(setNotification(`a new comment ${comment.comment} added`));
    } catch (exception) {
      dispatch(setNotification(`${exception.response.data.error}`, 'error'));
    }
  };
};

export default reducer;