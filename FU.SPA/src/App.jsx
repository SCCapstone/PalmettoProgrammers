import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Discover from './components/pages/Discover';
import Social from './components/pages/Social';
import Create from './components/pages/Create';
import NoPage from './components/pages/NoPage';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';

import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useState } from 'react';

function App() {
  const user = false;

  return (
    <>
      <Navbar auth={user} />
      <div className="container">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} /> 
          <Route path="/discover" element={<Discover />} />
          <Route path="/social" element={
            <ProtectedRoute auth={user} >
              <Social />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute auth={user} >
              <Create />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
