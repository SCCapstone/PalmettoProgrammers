import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import UserContext from '../context/userContext';
import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  const renderTabContent = () => {
    if (user) {
      // if user has a custom pfp then use that, if not then use MUI instead of default pfp
      const defaultPFP =
        !user.pfpUrl ||
        (user.pfpUrl !== null &&
          user.pfpUrl.includes(
            'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
          ));
      const pfpComponent = !defaultPFP ? (
        <Avatar src={user.pfpUrl} sx={{ width: 33, height: 33 }} />
      ) : (
        <Avatar
          {...stringAvatar(user.username)}
          sx={{ width: 33, height: 33, bgcolor: stringToColor(user.username) }}
        />
      );
      return (
        <>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            {pfpComponent}
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={logout}>Logout</button>
          </li>
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
          {user && (
            <>
              <CustomLink to="/social">Social</CustomLink>
              <CustomLink to="/create">Create</CustomLink>
            </>
          )}
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
function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  // split  name by spaces and filter empty entries
  let nameParts = name.split(' ').filter(Boolean);
  // get the first letter of the first part
  let initials = nameParts[0][0];
  // if there is a second part to name
  if (nameParts.length > 1) {
    initials += nameParts[1][0];
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}
