import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Discover from './components/pages/Discover';
import Social from './components/pages/Social';
import CreatePost from './components/pages/CreatePost';
import NoPage from './components/pages/NoPage';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import PostPage from './components/pages/PostPage';
import UserProfile from './components/pages/UserProfile';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './Theme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import UserProvider from './context/userProvider';
import AccountSettings from './components/pages/AccountSettings';
import EditPost from './components/pages/EditPost';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <ReactNotifications />
      <CssBaseline />
      <UserProvider>
        <Navbar />
        <Box sx={{ margin: '1rem', textAlign: 'center' }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route
              path="/social"
              element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/accountsettings/"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signin/:token" element={<SignIn />} />
            <Route path="/posts/:postId" element={<PostPage />} />

            <Route path="*" element={<NoPage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/posts/:postId/edit" element={<EditPost />} />
          </Routes>
        </Box>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
