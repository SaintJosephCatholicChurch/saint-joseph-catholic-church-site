import styled from '../../../util/styled.util';

const StyledFooterHeader = styled('h4')`
  color: #616169;
  font-size: 25px;
  line-height: 27px;
  font-weight: 300;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 12px;
`;

interface FooterHeaderProps {
  text: string;
}

const FooterHeader = ({ text }: FooterHeaderProps) => {
  return <StyledFooterHeader>{text}</StyledFooterHeader>;
};

export default FooterHeader;
