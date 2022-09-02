import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo, useState } from 'react';
import StyleCopy from '../../cms/StyleCopy';
import type { HomePageData, Slide } from '../../interface';
import times from '../../lib/times';
import HomepageView from '../homepage/HomepageView';

const PagePreview = ({ entry, document }: PreviewTemplateComponentProps) => {
  const [slides, setSlides] = useState<Slide[]>([]);

  const data = useMemo(() => entry.toJS().data as HomePageData, [entry]);

  return useMemo(
    () => (
      <StyleCopy document={document}>
        <HomepageView homePageData={data} times={times} />
      </StyleCopy>
    ),
    [data, document]
  );
};
export default PagePreview;
