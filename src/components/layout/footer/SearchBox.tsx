import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useSmallScreen from '../../../util/smallScreen.util';

const SearchBox = () => {
  const isSmallScreen = useSmallScreen();

  return (
    <Box sx={{ display: 'flex' }}>
      <TextField
        variant="outlined"
        size={isSmallScreen ? 'medium' : 'small'}
        placeholder="Enter your search"
        sx={{ background: 'white', mb: 4 }}
        fullWidth
      />
    </Box>
  );
};

export default SearchBox;
