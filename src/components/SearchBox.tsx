import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { memo, useCallback, useState } from 'react';
import { isEmpty } from '../util/string.util';
import styled from '../util/styled.util';
import { useMediaQueryDown } from '../util/useMediaQuery';
import useNavigate from '../util/useNavigate';

const StyledSearchBox = styled('div')`
  display: flex;
`;

interface SearchBoxProps {
  disableMargin?: boolean;
}

const SearchBox = memo(({ disableMargin = false }: SearchBoxProps) => {
  const isSmallScreen = useMediaQueryDown('lg');
  const navigate = useNavigate();

  const [value, setValue] = useState<string>('');

  const onSearch = useCallback(() => {
    if (isEmpty(value.trim())) {
      return;
    }
    navigate(`/search?q=${value}`);
  }, [navigate, value]);

  return (
    <StyledSearchBox>
      <TextField
        variant="outlined"
        size={isSmallScreen ? 'medium' : 'small'}
        placeholder="Search..."
        sx={{ background: 'white', mb: !disableMargin ? 4 : undefined }}
        fullWidth
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSearch();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize={isSmallScreen ? 'medium' : 'small'} onClick={onSearch} sx={{ cursor: 'pointer' }} />
            </InputAdornment>
          )
        }}
      />
    </StyledSearchBox>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
