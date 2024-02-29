import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Discover from './components/pages/Discover';
import Social from './components/pages/Social';
import Create from './components/pages/Create';
import NoPage from './components/pages/NoPage';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import PostPage from './components/pages/PostPage';
import UserProfile from './components/pages/UserProfile';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './Theme';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import UserProvider from './context/userProvider';
import './App.css';
import ProfileSettings from './components/pages/ProfileSettings';
import AccountSettings from './components/pages/AccountSettings';
import EditPost from './components/pages/EditPost';

function App() {
  //creating to do behavioral test, which is connected to createPostBehavior.test.js and CreatPost.jsx
  const CreatePosts = [ 
    { id: 1, name: 'test CP', completed: false,},
    { id: 2, name: 'test CP2', completed: true,},
  ];

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <UserProvider>
        <Navbar />
        <div className="container">
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
                  <Create />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profilesettings/"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
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
            <Route path="/posts/:postId" element={<PostPage />} />

            <Route path="*" element={<NoPage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/posts/:postId/edit" element={<EditPost />} />
          </Routes>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
