import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export default UserContext;