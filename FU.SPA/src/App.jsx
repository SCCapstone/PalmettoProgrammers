import React from 'react'
import Navbar from "./Navbar"
import Home from "./pages/Home"
import Discover from "./pages/Discover"
import Social from "./pages/Social"
import Create from "./pages/Create"

function App() {
  let component
  switch (window.location.pathname) {
    case "/":
      component = <Home />
      break
    case "/home":
      component = <Home />
      break
    case "/discover":
      component = <Discover />
      break
      case "/social":
        component = <Social />
        break
      case "/create":
        component = <Create />
        break
  }
return (
  <>
  <Navbar />
  {component}
  </>
)
}

export default App
