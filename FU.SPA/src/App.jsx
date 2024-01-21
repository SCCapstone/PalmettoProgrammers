import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Discover from './components/pages/Discover';
import Social from './components/pages/Social';
import Create from './components/pages/Create';
import NoPage from './components/pages/NoPage';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import Chat from './components/pages/Chat';
import PostPage from './components/pages/PostPage';
import createPage from './components/CreatePost'; //using for behavioral testing

import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import UserProvider from './context/userProvider';

function App() {
  //creating to do behavioral test, which is connected to createPostBehavior.test.js and CreatPost.jsx
  const CreatePosts = [
    { id: 1, title: 'test CP', completed: false },
    { id: 2, title: 'test CP', completed: true },
  ];

  return (
    <>
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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/posts/:postId" element={<PostPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
      </UserProvider>
    </>
  );
}

export default App;
