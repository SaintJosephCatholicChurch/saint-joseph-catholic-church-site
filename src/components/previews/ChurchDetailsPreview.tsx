import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import type { ChurchDetails } from '../../interface';
import Footer from '../layout/footer/Footer';

const ChurchDetailsPreview = ({ entry }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data as ChurchDetails, [entry]);

  return useMemo(() => <Footer churchDetails={data} />, [data]);
};

export default ChurchDetailsPreview;
