import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

const HeaderPrimaryTextWrapper = styled(Box)`
  display: flex;
  gap: 10px;
`;

const HeaderPrimaryText = styled(Box)`
  color: #ffffff;
  margin: 0;
  letter-spacing: 1.5px;
  word-spacing: 2px;
  text-transform: uppercase;
  font-size: 36px;
  line-height: 43px;

  &::first-letter {
    font-size: 43px;
  }
`;

interface LogoPrimaryTextProps {
  children: string;
}

const LogoPrimaryText = ({ children }: LogoPrimaryTextProps) => {
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <HeaderPrimaryTextWrapper>
      {words?.map((word) => (
        <HeaderPrimaryText key={`header-primary-text-${word}`} component="h1">
          {word}
        </HeaderPrimaryText>
      ))}
    </HeaderPrimaryTextWrapper>
  );
};

export default LogoPrimaryText;
