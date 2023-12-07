import { Link, useMatch, useResolvedPath } from 'react-router-dom';

export default function Navbar() {
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
        <ul>
          <CustomLink to="/SignIn">Sign In</CustomLink>
          <CustomLink to="/SignUp">Sign Up</CustomLink>
        </ul>
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
