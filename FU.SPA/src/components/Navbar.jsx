import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import UserContext from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const renderTabContent = () => {
    if (user) {
      return (
        <>
          <p>{user.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      );
    } else {
      return (
        <>
          <CustomLink to="/SignIn">Sign In</CustomLink>
          <CustomLink to="/SignUp">Sign Up</CustomLink>
        </>
      );
    }
  };

  return (
    <nav className="nav">
      <div className="left-content">
        <Link href="/" className="site-title">
          Forces Unite
        </Link>
        <ul>
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/discover">Discover</CustomLink>
          <CustomLink to="/social">Social</CustomLink>
          <CustomLink to="/create">Create</CustomLink>
        </ul>
      </div>
      <div className="right-content">
        <ul>{renderTabContent()}</ul>
      </div>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
