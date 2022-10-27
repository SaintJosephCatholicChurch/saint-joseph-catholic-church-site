import type { GetStaticProps } from 'next/types';
import PageLayout from '../components/PageLayout';
import PageContentView from '../components/pages/PageContentView';
import SearchBox from '../components/SearchBox';
import { getSidebarProps, SidebarProps } from '../lib/sidebar';

interface PageProps extends SidebarProps {}

const NotFoundPage = ({ ...sidebarProps }: PageProps) => {
  return (
    <PageLayout url={`/404`} title="Page not found" {...sidebarProps}>
      <PageContentView>
        <p>Sorry, the page you are looking for was either not found or does not exist.</p>
        <p>Try searching below or return to the home page.</p>
      </PageContentView>
      <SearchBox value="" disableMargin />
    </PageLayout>
  );
};

export default NotFoundPage;

export const getStaticProps: GetStaticProps = async (): Promise<{ props: PageProps }> => {
  return {
    props: {
      ...getSidebarProps()
    }
  };
};
