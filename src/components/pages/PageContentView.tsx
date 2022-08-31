import { ReactNode } from 'react';
import contentStyles from '../../../public/styles/content.module.css';
import { getTag } from '../../lib/tags';
import TagButton from '../TagButton';

interface PageViewProps {
  tags?: string[];
  children: ReactNode;
}

const PageContentView = ({ tags = [], children }: PageViewProps) => {
  return (
    <>
      <div className={`content ${contentStyles.content}`}>{children}</div>
      {tags.length ? (
        <ul>
          {tags.map((it, i) => (
            <li key={i}>
              <TagButton tag={getTag(it)} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default PageContentView;
