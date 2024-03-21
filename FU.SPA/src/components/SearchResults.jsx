import { Stack, Typography, Pagination } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const searchResults = ({ page, totalResults, queryLimit, setPage }) => {
  return totalResults === 0 ? (
    <div style={{ textAlign: 'center', color: 'violet', padding: '20px' }}>
      <SearchOffIcon style={{ fontSize: '64px' }} />
      <Typography variant="h5">No Results Found</Typography>
    </div>
  ) : (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination
        count={Math.ceil(totalResults / queryLimit)}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="secondary"
      />
    </Stack>
  );
};

export default searchResults;
