import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import StyleCopy from '../../cms/StyleCopy';
import { ChurchDetails } from '../../interface';
import Footer from '../layout/footer/Footer';

const ChurchDetailsPreview = ({ entry, document }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data as ChurchDetails, [entry]);
  console.log('[data] church_details', data);

  return useMemo(
    () => (
      <>
        <StyleCopy document={document}>
          <Footer churchDetails={data} />
        </StyleCopy>
      </>
    ),
    [data, document]
  );
};

export default ChurchDetailsPreview;
