import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const renderProfile = () => (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user?.username} src={user?.pfpUrl} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate(`/profile/${user?.id}`);
          }}
        >
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate(`/accountsettings`);
          }}
        >
          <Typography textAlign="center">Account</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            logout();
          }}
        >
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" enableColorOnDark>
      <Toolbar>
        <Typography
          noWrap
          component="a"
          onClick={() => navigate('/')}
          sx={{
            mr: 2,
            fontFamily:
              "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
            fontSize: '1.7rem',
            cursor: 'pointer'
          }}
        >
          Forces Unite
        </Typography>

        <Box sx={{ display: 'flex', flexGrow: 1, flexWrap: 'nowrap' }}>
          <Button color="inherit" onClick={() => navigate('/discover')}>
            Discover
          </Button>
          {user && (
            <>
              <Button color="inherit" onClick={() => navigate('/social')}>
                Social
              </Button>
              <Button color="inherit" onClick={() => navigate('/create')}>
                Create
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          {user ? (
            renderProfile()
          ) : (
            <>
              <Button
                sx={{ mr: 1 }}
                color="inherit"
                onClick={() => navigate('/SignIn')}
              >
                Sign in
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate('/SignUp')}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
