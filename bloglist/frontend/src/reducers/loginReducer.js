const reducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, ...action.user };
    case 'LOGOUT_USER':
      return null;
    default:
      return state;
  }
};

export const loginUser = (user) => {
  return async dispatch => {
    dispatch({
      type: 'LOGIN_USER',
      user,
    });
  };
};

export const logoutUser = () => {
  return async dispatch => {
    dispatch({
      type: 'LOGOUT_USER',
    });
  };
};

export default reducer;