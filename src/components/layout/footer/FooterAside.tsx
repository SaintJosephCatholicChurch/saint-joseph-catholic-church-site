import { styled } from '@mui/material/styles';

import FooterHeader from './FooterHeader';

const StyledFooterAside = styled('aside')`
  margin-bottom: 32px;
`;

const StyledFooterAsideText = styled('div')`
  color: rgb(68, 68, 68);
  font-size: 16px;
  line-height: 24px;
  font-style: italic;
  font-weight: 400;
  margin: 0;
`;

interface FooterAsideProps {
  title: string;
  text: string;
}

const FooterAside = ({ title, text }: FooterAsideProps) => {
  return (
    <StyledFooterAside>
      <FooterHeader text={title} />
      <StyledFooterAsideText>{text}</StyledFooterAsideText>
    </StyledFooterAside>
  );
};

export default FooterAside;
