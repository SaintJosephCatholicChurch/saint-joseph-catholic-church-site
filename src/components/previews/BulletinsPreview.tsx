import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import StyleCopy from '../../cms/StyleCopy';
import { Bulletin } from '../../interface';
import ParishBulletinsView from '../pages/custom/ParishBulletinsView';

const BulletinsPreview = ({ entry, document }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data.bulletins as Bulletin[], [entry]);

  return useMemo(
    () => (
      <>
        <StyleCopy document={document}>
          <ParishBulletinsView bulletins={data} />
        </StyleCopy>
      </>
    ),
    [data, document]
  );
};

export default BulletinsPreview;
