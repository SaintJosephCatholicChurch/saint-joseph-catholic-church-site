import { styled } from '@mui/material/styles';
import contentStyles from '../../public/styles/content.module.css';
import PageLayout from '../components/PageLayout';
import AskForm from '../components/pages/custom/ask/AskForm';
import { getRecentPostsStaticProps, RecentPostsProps } from '../lib/posts';

const StyledDetails = styled('div')`
  margin-bottom: 32px;
`;

type AskProps = RecentPostsProps;

const Ask = ({ recentPosts }: AskProps) => {
  return (
    <PageLayout url="/ask" title="Did You Know? Question Submission" recentPosts={recentPosts}>
      <StyledDetails className={contentStyles.content}>
        <p>
          Do you have a question regarding the Catholic Faith that you would like answered as a part of our Did You
          Know? Campaign?
        </p>
        <p>To ask a question, fill in the request form below.</p>
      </StyledDetails>
      <AskForm />
    </PageLayout>
  );
};

export default Ask;

export const getStaticProps = getRecentPostsStaticProps;
