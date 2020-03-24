const {
  REACT_APP_INITIAL_AMOUNT: initialAmount = 24,
  REACT_APP_PER_PAGE: perPage = 480,
  REACT_APP_MIN_USERS_COUNT: minUsersCount = 800
} = process.env;

export default {
  initialAmount,
  perPage,
  minUsersCount
};

export const UserTypes = {
  AUTH_LOGIN_REQUEST: 'AUTH_LOGIN_REQUEST',
  AUTH_LOGOUT_REQUEST: 'AUTH_LOGOUT_REQUEST',
  AUTH_CHECK_REQUEST: 'AUTH_CHECK_REQUEST',
  USERS_ADD_TO_BLACKLIST_REQUEST: 'USERS_ADD_TO_BLACKLIST_REQUEST',
  USERS_DELETE_TWEET_REQUEST: 'USERS_DELETE_TWEET_REQUEST',
  USERS_COUNT_REQUEST: 'USERS_COUNT_REQUEST'
};
