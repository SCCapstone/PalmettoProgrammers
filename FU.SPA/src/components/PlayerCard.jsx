import {
    Card,
    CardActions,
    Button,
    CardContent,
    Typography,
    Chip,
    CardHeader,
    Avatar,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
 // import './PlayerCard.css';
  
  const PlayerCard = ({ user, showActions }) => {
    const navigate = useNavigate();
    console.log('PlayerCard user prop:', user);

    const player = user.Username;
    const defaultPfp =
      !user.pfpUrl ||
      (user.pfpUrl !== null &&
        user.pfpUrl.includes(
          'https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png',
        ));
    if (showActions === undefined) {
      showActions = true;
    }
  
    const stringToColor = (string) => {
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
    };
  
    const initials = (name) => {
      // split  name by spaces and filter empty entries
      let nameParts = name.split(' ').filter(Boolean);
      // get the first letter of the first part
      let initials = nameParts[0][0];
      // if there is a second part to name
      if (nameParts.length > 1) {
        initials += nameParts[1][0];
      }
  
      return initials;
    };
  
    const renderPfp = () => {
      return defaultPfp ? (
        <Avatar
          sx={{
            bgcolor: stringToColor(user.username),
            width: 30,
            height: 30,
          }}
        >
          {initials(user.username)}
        </Avatar>
      ) : (
        <Avatar
          alt={user.username}
          src={user.pfpUrl}
          sx={{ width: 30, height: 30 }}
        />
      );
    };
  
    return (
      <Card
        style={{
          textAlign: 'left',
          width: '250px',
          backgroundColor: '#31084A',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {renderPfp()}
                <Typography
                  variant="h5"
                  style={{
                    color: '#E340DC',
                    fontSize: 'medium',
                    display: 'flex',
                    gap: '5px',
                  }}
                >
                  <div
                    className="user-name"
                    onClick={() => navigate(`/profile/${player.id}`)}
                  >
                    {player.username}
                  </div>
                </Typography>
              </div>
              <div
                style={{ borderTop: '2px solid #E340DC', marginTop: '5px' }}
              ></div>
            </>
          }
        />
        <CardContent
          style={{
            width: 'auto',
            paddingTop: '0px',
            flex: 1,
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" color="#FFF">
            {player.bio}
          </Typography>
          <div style={{ paddingTop: '10px' }}>
            {user.favoritetags.map((t) => (
              <Chip
                key={t}
                label={'# ' + t}
                variant="outlined"
                style={{
                  color: '#E340DC',
                  borderColor: '#E340DC',
                  border: '2px solid #E340DC',
                }}
              />
            ))}
          </div>
        </CardContent>
        {showActions && (
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button
              style={{ backgroundColor: '#E340DC', color: '#FFF', width: '100%' }}
              onClick={() => navigate(`/profile/${player.id}`)}
            >
              View
            </Button>
          </CardActions>
        )}
      </Card>
    );
  };

  export default PlayerCard;