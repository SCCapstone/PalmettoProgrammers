import { Stack, Typography, Pagination } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const searchResults = ({
  hasResults,
  page,
  totalResults,
  queryLimit,
  setPage,
}) => {
  return hasResults ? (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination
        count={Math.ceil(totalResults / queryLimit)}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="secondary"
      />
    </Stack>
  ) : (
    <div style={{ textAlign: 'center', color: 'violet', padding: '20px' }}>
      <SearchOffIcon style={{ fontSize: '64px' }} />
      <Typography variant="h5">No Results Found</Typography>
    </div>
  );
};

export default searchResults;
