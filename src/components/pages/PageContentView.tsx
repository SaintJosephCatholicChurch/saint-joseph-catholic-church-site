import contentStyles from '../../../public/styles/content.module.css';

import type { ReactNode } from 'react';

interface PageViewProps {
  children: ReactNode;
}

const PageContentView = ({ children }: PageViewProps) => {
  return (
    <>
      <div className={`content ${contentStyles.content}`}>{children}</div>
    </>
  );
};

export default PageContentView;
