import Navbar from "./Navbar"
import Home from "./pages/Home"
import Discover from "./pages/Discover"
import Social from "./pages/Social"
import Create from "./pages/Create"
import { Route, Routes } from "react-router-dom"
function App() {
return (
  <>
  <Navbar />
  <div className="container">
    <Routes>
      <Route path="/home" element= {<Home />} />
      <Route path="/discover" element= {<Discover />} />
      <Route path="/social" element= {<Social />} />
      <Route path="/create" element= {<Create />} />
    </Routes>
  </div>
  </>
)
}

export default App
