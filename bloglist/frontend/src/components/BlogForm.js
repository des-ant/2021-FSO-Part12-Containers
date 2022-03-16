import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';

const BlogForm = ({ createBlog }) => {
  const addBlog = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    createBlog({
      title,
      author,
      url,
    });
    event.target.title.value = '';
    event.target.author.value = '';
    event.target.url.value = '';
  };

  return (
    <div className='BlogFormDiv'>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            id="title"
            type="text"
            name="title"
          />
        </div>
        <div>
          <TextField
            label="author"
            id="author"
            type="text"
            name="author"
          />
        </div>
        <div>
          <TextField
            label="url"
            id="url"
            type="text"
            name="url"
          />
        </div>
        <div>
          <Button
            id="blogform-button"
            type="submit"
            variant="contained"
            color="primary"
          >
            create
          </Button>
        </div>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;