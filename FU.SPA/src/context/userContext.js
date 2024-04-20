import { createContext } from 'react';

// Creates a context for users that keeps track of the current user and
// their auth token
const UserContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export default UserContext;
