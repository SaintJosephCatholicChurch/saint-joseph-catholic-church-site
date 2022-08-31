import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { memo } from 'react';
import useSmallScreen from '../util/smallScreen.util';

interface SearchBoxProps {
  disableMargin?: boolean;
}

const SearchBox = memo(({ disableMargin = false }: SearchBoxProps) => {
  const isSmallScreen = useSmallScreen();

  return (
    <Box sx={{ display: 'flex' }}>
      <TextField
        variant="outlined"
        size={isSmallScreen ? 'medium' : 'small'}
        placeholder="Search..."
        sx={{ background: 'white', mb: !disableMargin ? 4 : undefined }}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize={isSmallScreen ? 'medium' : 'small'} />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
