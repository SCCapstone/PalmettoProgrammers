import { Link, useMatch, useResolvedPath } from 'react-router-dom';

export default function Navbar( {auth} ) {
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
<<<<<<< HEAD
          { auth ? (<div>Sign Out</div>) : (
            <div>
              <CustomLink to="/SignIn">Sign In</CustomLink>
              <CustomLink to="/SignUp">Sign Up</CustomLink>
            </div>
          )}
=======
          <CustomLink to="/SignIn">Sign In</CustomLink>
          <CustomLink to="/SignUp">Sign Up</CustomLink>
>>>>>>> main
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
