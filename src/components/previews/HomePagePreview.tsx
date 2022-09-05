import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import type { HomePageData } from '../../interface';
import times from '../../lib/times';
import HomepageView from '../homepage/HomepageView';

const PagePreview = ({ entry }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data as HomePageData, [entry]);

  return useMemo(() => <HomepageView homePageData={data} times={times} />, [data]);
};
export default PagePreview;
