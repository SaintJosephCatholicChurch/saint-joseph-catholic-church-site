'use client';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';

import { isEmpty } from '../util/string.util';
import { useMediaQueryDown } from '../util/useMediaQuery';

const StyledSearchBox = styled('div')`
  display: flex;
`;

interface SearchBoxProps {
  disableMargin?: boolean;
  value: string | undefined;
}

const SearchBox = memo(({ disableMargin = false, value: controlledValue = '' }: SearchBoxProps) => {
  const isSmallScreen = useMediaQueryDown('lg');
  const router = useRouter();

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

  const onSearch = useCallback(() => {
    if (isEmpty(value.trim())) {
      return;
    }
    router.push(`/search?q=${value}`);
  }, [router, value]);

  return (
    <StyledSearchBox>
      <TextField
        variant="outlined"
        size={isSmallScreen ? 'medium' : 'small'}
        placeholder="Search..."
        value={value}
        sx={{ background: 'white', mt: !disableMargin ? undefined : 0, mb: !disableMargin ? 4 : 0 }}
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
