import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { memo } from 'react';
import styled from '../util/styled.util';
import { useMediaQueryDown } from '../util/useMediaQuery';

const StyledSearchBox = styled('div')`
  display: flex;
`;

interface SearchBoxProps {
  disableMargin?: boolean;
}

const SearchBox = memo(({ disableMargin = false }: SearchBoxProps) => {
  const isSmallScreen = useMediaQueryDown('lg');

  return (
    <StyledSearchBox>
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
    </StyledSearchBox>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
