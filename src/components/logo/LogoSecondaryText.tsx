import { useMemo } from 'react';
import styled from '../../util/styled.util';

const StyledHeaderSecondaryTextWrapper = styled('div')`
  display: flex;
  gap: 8px;
`;

const StyledHeaderSecondaryText = styled('h3')`
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
    <StyledHeaderSecondaryTextWrapper>
      {words?.map((word) => (
        <StyledHeaderSecondaryText key={`header-primary-text-${word}`}>{word}</StyledHeaderSecondaryText>
      ))}
    </StyledHeaderSecondaryTextWrapper>
  );
};

export default LogoSecondaryText;
