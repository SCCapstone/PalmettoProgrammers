import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Discover from './components/pages/Discover';
import Social from './components/pages/Social';
import Create from './components/pages/Create';
import NoPage from './components/pages/NoPage';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';

import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/social" element={<Social />} />
          <Route path="/create" element={<Create />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
