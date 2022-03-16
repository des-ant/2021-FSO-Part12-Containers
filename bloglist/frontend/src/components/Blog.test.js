import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
// import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let likeHandler;

  beforeEach(() => {
    const blog = {
      title: 'Blog title should be rendered',
      author: 'Blog author should also be rendered',
      url: 'Blog url should not be rendered by default'
    };

    likeHandler = jest.fn();
    const deleteHandler = jest.fn();
    const username = 'mockUser';

    component = render(
      <Blog
        blog={blog}
        increaseLikes={likeHandler}
        deleteBlog={deleteHandler}
        username={username}
      />
    );
  });

  test('renders title and author but not url or number of likes by default', () => {
    expect(component.container).toHaveTextContent(
      'Blog title should be rendered'
    );

    expect(component.container).toHaveTextContent(
      'Blog author should also be rendered'
    );

    const blogTitleAuthor = component.getByText(
      'Blog title should be rendered Blog author should also be rendered'
    );
    expect(blogTitleAuthor).toBeVisible();

    const blogUrl = component.getByText(
      'Blog url should not be rendered by default'
    );
    expect(blogUrl).not.toBeVisible();
    const blogUrlParent = blogUrl.parentElement;
    expect(blogUrlParent).toHaveStyle('display: none');

    const blogLikes = component.getByText(
      'likes'
    );
    expect(blogLikes).not.toBeVisible();
    const blogLikesParent = blogLikes.parentElement;
    expect(blogLikesParent).toHaveStyle('display: none');
  });

  test('blogs url and number of likes are shown when the button controlling the shown details has been clicked', () => {
    const viewButton = component.getByText('view');
    fireEvent.click(viewButton);

    const blogUrl = component.getByText(
      'Blog url should not be rendered by default'
    );
    expect(blogUrl).toBeVisible();
    const blogUrlParent = blogUrl.parentElement;
    expect(blogUrlParent).not.toHaveStyle('display: none');

    const blogLikes = component.getByText(
      'likes'
    );
    expect(blogLikes).toBeVisible();
    const blogLikesParent = blogLikes.parentElement;
    expect(blogLikesParent).not.toHaveStyle('display: none');
  });

  test('clicking the like button calls event handler twice', () => {
    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(likeHandler.mock.calls).toHaveLength(2);
  });
});