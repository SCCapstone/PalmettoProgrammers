import Navbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Social from './pages/Social';
import Create from './pages/Create';
import NoPage from './pages/NoPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

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
