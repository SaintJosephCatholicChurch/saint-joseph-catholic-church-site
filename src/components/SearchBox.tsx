import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { memo, useCallback, useEffect, useState } from 'react';

import { useMediaQueryDown } from '../util/useMediaQuery';

import type { FormEvent } from 'react';

const StyledSearchBox = styled('form')`
  display: flex;
  width: 100%;
`;

const HiddenSubmitButton = styled('button')`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

interface SearchBoxProps {
  disableMargin?: boolean;
  value: string | undefined;
}

const SearchBox = memo(({ disableMargin = false, value: controlledValue = '' }: SearchBoxProps) => {
  const isSmallScreen = useMediaQueryDown('lg');

  const [value, setValue] = useState<string>('');
  useEffect(() => {
    if (!controlledValue) {
      return;
    }

    if (controlledValue !== value) {
      setValue(controlledValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue]);

  const submitSearch = useCallback((rawValue: string) => {
    const trimmedValue = rawValue.trim();

    if (!trimmedValue) {
      return;
    }

    window.location.assign(`/search?q=${encodeURIComponent(trimmedValue)}`);
  }, []);

  return (
    <StyledSearchBox
      action="/search"
      method="get"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const searchQuery = new FormData(event.currentTarget).get('q');
        submitSearch(typeof searchQuery === 'string' ? searchQuery : '');
      }}
    >
      <TextField
        name="q"
        variant="outlined"
        size={isSmallScreen ? 'medium' : 'small'}
        placeholder="Search..."
        value={value}
        sx={{ background: 'white', mt: !disableMargin ? undefined : 0, mb: !disableMargin ? 4 : 0 }}
        fullWidth
        required
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
        inputProps={{
          onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitSearch(event.currentTarget.value);
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton type="submit" size={isSmallScreen ? 'medium' : 'small'} aria-label="Search">
                <SearchIcon fontSize={isSmallScreen ? 'medium' : 'small'} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <HiddenSubmitButton type="submit" tabIndex={-1} aria-hidden="true" />
    </StyledSearchBox>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
