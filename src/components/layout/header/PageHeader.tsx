import styles from '../../../lib/styles';
import styled from '../../../util/styled.util';

const StyledPageHeader = styled('div')(
  ({ theme }) => `
    background-image: url(${styles.header_background});
    background-repeat: repeat-x;
    background-position: center top;

    ${theme.breakpoints.down('md')} {
      padding: 98px 0 40px;
    }

    ${theme.breakpoints.up('md')} {
      padding: 130px 0 40px;
    }

    width: 100%;
  `
);

const StyledTitle = styled('h1')(
  ({ theme }) => `
    color: ${styles.header_color};
    font-style: ${styles.header_font_style};
    text-align: center;
    margin: 0;
    
    ${theme.breakpoints.down('md')} {
      font-size: 30px;
      line-height: 30px;
      padding-left: 24px;
      padding-right: 24px;
    }

    ${theme.breakpoints.up('md')} {
      font-size: 50px;
      line-height: 50px;
    }

    font-weight: 400;
  `
);

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <StyledPageHeader>
      <StyledTitle>{title}</StyledTitle>
    </StyledPageHeader>
  );
};

export default PageHeader;
