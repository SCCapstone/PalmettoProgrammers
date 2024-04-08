import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/userContext';
import RelationService from '../services/relationService';
import { useContext, useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(location.pathname);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  useEffect(() => {
    setPreviousPath(currentPath);
    setCurrentPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const checkForNewRequests = async () => {
      if (user && user.id) {
        const query = {
          relation: RelationService.STATUS.PENDING,
        };
        try {
          const { totalCount } = await RelationService.getRelations(user.id, query);
            setHasNewRequests(totalCount > 0);
            setNewRequestsCount(totalCount);
        } catch (error) {
          console.error('Failed to fetch new requests:', error);
        }
      }
    };

    checkForNewRequests();
    
  }, [user]);

  const isActiveMenuItem = (menuItemTitle) => {
    // If the current path contains the menuItemTitle and it's not the post page, then it is active
    const containsMatch =
      currentPath.includes(menuItemTitle) && !currentPath.includes('post');

    const isPostPage = currentPath.includes('post');
    var postMatch = isPostPage && previousPath.includes(menuItemTitle);

    // Discover active if post page, checking for discover, and previous path is a post
    // This is a special case for when the post page is refreshed
    if (
      isPostPage &&
      menuItemTitle === 'discover' &&
      previousPath.includes('post')
    ) {
      postMatch = true;
    }

    return containsMatch || postMatch;
  };

  
const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: -7,
    top: 3,
  },
}));

  const renderProfile = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Typography textAlign="center">{user?.username}</Typography>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Badge 
              color="secondary"
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={newRequestsCount}
              invisible={!hasNewRequests}
              sx={{
                '& .MuiBadge-dot': {
                  height: '12px',
                  width: '12px',
                  borderRadius: '6px',       
                },
              }}
              >
            <Avatar
              alt={user?.username}
              src={user?.pfpUrl}
              sx={{
                border: '2px solid #ffffff',
              }}
            />
            </Badge>
          </IconButton>
        </Tooltip>
      </div>
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
            navigate('/social?o=Users&page=1&r=Pending');
            setHasNewRequests(false);
            setNewRequestsCount(0);
          }}
        >
          <StyledBadge
            color="secondary"
            variant="dot"
            invisible={!hasNewRequests}
            >
            <Typography textAlign="center">Friend Requests</Typography>
          </StyledBadge>
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
            cursor: 'pointer',
          }}
        >
          Forces Unite
        </Typography>

        <Box
          sx={{
            height: '64px',
            display: 'flex',
            flexGrow: 1,
            flexWrap: 'nowrap',
          }}
        >
          <Button
            className={isActiveMenuItem('discover') ? 'active' : ''}
            color="inherit"
            onClick={() => navigate('/discover')}
          >
            Discover
          </Button>
          {user && (
            <>
              <Button
                color="inherit"
                className={isActiveMenuItem('social') ? 'active' : ''}
                onClick={() => navigate('/social')}
              >
                Social
              </Button>
              <Button
                color="inherit"
                className={isActiveMenuItem('create') ? 'active' : ''}
                onClick={() => navigate('/create')}
              >
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
