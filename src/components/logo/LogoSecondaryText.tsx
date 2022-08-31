import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

const HeaderSecondaryTextWrapper = styled('div')`
  display: flex;
  gap: 8px;
`;

const HeaderSecondaryText = styled(Box)`
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  font-size: 18px;
  line-height: 22px;

  &::first-letter {
    font-size: 22px;
  }
`;

interface LogoSecondaryTextProps {
  children: string;
}

const LogoSecondaryText = ({ children }: LogoSecondaryTextProps) => {
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <HeaderSecondaryTextWrapper>
      {words?.map((word) => (
        <HeaderSecondaryText key={`header-primary-text-${word}`} component="h3">
          {word}
        </HeaderSecondaryText>
      ))}
    </HeaderSecondaryTextWrapper>
  );
};

export default LogoSecondaryText;
