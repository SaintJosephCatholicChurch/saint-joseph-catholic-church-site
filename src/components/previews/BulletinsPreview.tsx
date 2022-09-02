import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import StyleCopy from '../../cms/StyleCopy';
import { Bulletin } from '../../interface';
import BulletListButton from '../pages/custom/BulletListButton';

const BulletinsPreview = ({ entry, document }: PreviewTemplateComponentProps) => {
  const theme = useTheme();

  const bulletins = useMemo(() => entry.toJS().data.bulletins as Bulletin[], [entry]);

  const bulletinListItems = useMemo(
    () =>
      bulletins?.map((aBulletin, index) => (
        <BulletListButton key={`bulletin-${index}`} bulletin={aBulletin} selected={false} openInNewWindow />
      )),
    [bulletins]
  );

  return useMemo(
    () => (
      <StyleCopy document={document}>
        <List
          sx={{
            maxWidth: 300,
            margin: '24px auto 0',
            backgroundColor: '#e8e5e1',
            [theme.breakpoints.down('lg')]: {
              display: 'none'
            }
          }}
          disablePadding
        >
          {bulletinListItems}
        </List>
      </StyleCopy>
    ),
    [bulletinListItems, document, theme.breakpoints]
  );
};

export default BulletinsPreview;
