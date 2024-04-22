import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Theme from '../../Theme';
import CreatePostScreenshot from '../../../assets/create-post-view.png';
import DiscoverPostScreenshot from '../../../assets/discover-posts-view.png';
import PostViewScreenshot from '../../../assets/post-view.png';
import FriendsViewScreenshot from '../../../assets/friends-view.png';

// Home landing page
const Home = () => {
  return (
    <Box sx={{ maxWidth: 800, p: 2, mx: 'auto', textAlign: 'left' }}>
      <Stack spacing={1} alignItems="center">
        <Box sx={{ py: 8, width: '100%' }}>
          <Typography variant="h3">
            Connect with others. <br />
            Play together.
          </Typography>
          <Typography variant="h5" sx={{ py: 2, maxWidth: 500 }}>
            Forces Unite is the next matchmaking platform to find players and
            make friends.
          </Typography>
        </Box>
        <Screenshot src={DiscoverPostScreenshot} />
        <Typography variant="h5" sx={{ pt: 2 }}>
          Don&apos;t limit yourself to restrictive or random in-game
          matchmaking. Find like-minded players and play how you want when you
          want. Whether that be now or next week.
        </Typography>
        <SectionBig headerText="Lead the Way">
          If you can&apos;t find a match, make a new post and invite others to
          join!
        </SectionBig>
        <Screenshot src={CreatePostScreenshot} />
        <SectionBig headerText="Link Up">
          As a post member, discuss meetup detail, strategize a game plan, or
          just chat.
        </SectionBig>
        <Screenshot src={PostViewScreenshot} />
        <SectionBig headerText="Stay Connected">
          Befriend others to keep in touch and meet up later.
        </SectionBig>
        <Screenshot src={FriendsViewScreenshot} />
        <SectionBig headerText="Showcase" />
        <iframe
          style={{ width: '100%', aspectRatio: '16/9' }}
          src="https://www.youtube.com/embed/lAGrIrY7h3o?si=P-e0W_LpiEpUJZTa&color=white"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
        <SectionBig headerText="About" maxBodyWidth="100%">
          This website was created by PalmettoProgrammers for a 2023-2024 UofSC
          Capstone project. The team consists of{' '}
          <Link href="https://github.com/AaronKeys">Aaron Keys</Link>,{' '}
          <Link href="https://github.com/epadams">Ethan Adams</Link>,{' '}
          <Link href="https://www.linkedin.com/in/evan-m-scales/">
            Evan Scales
          </Link>
          ,{' '}
          <Link href="https://github.com/Jackson-Williams-15">
            Jackson Williams
          </Link>
          , and{' '}
          <Link href="https://github.com/jbytes1027">James Pretorius</Link>. The
          project is available on{' '}
          <Link href="https://github.com/SCCapstone/PalmettoProgrammers">
            GitHub
          </Link>
          .
        </SectionBig>
      </Stack>
    </Box>
  );
};

const SectionBig = ({ headerText, children, maxBodyWidth }) => (
  <Box sx={{ pt: 8, width: '100%' }}>
    <Typography variant="h3" sx={{ mb: 2 }}>
      {headerText}
    </Typography>
    <Typography variant="h5" sx={{ mb: 2, maxWidth: maxBodyWidth ?? 550 }}>
      {children}
    </Typography>
  </Box>
);

const Screenshot = ({ src }) => (
  <Box
    component="img"
    sx={{
      width: '100%',
      borderStyle: 'solid',
      color: Theme.palette.primary.light,
    }}
    alt="A screenshot"
    src={src}
  />
);

export default Home;
