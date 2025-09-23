import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { memo } from 'react';

import { useFormattedBulletinDate, useFormattedBulletinUrlDate } from './util';

import type { ListChildComponentProps } from 'react-window';
import type { Bulletin } from '../../../../interface';

const StyledListItemWrapper = styled('div')`
  position: relative;
`;

const StyledListItemPrimary = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface BulletListButtonProps {
  bulletin: Bulletin;
  selected: boolean;
  openInNewWindow?: boolean;
  style: ListChildComponentProps['style'];
}

const BulletListButton = memo(({ bulletin, selected, openInNewWindow = false, style }: BulletListButtonProps) => {
  const date = useFormattedBulletinDate(bulletin);
  const urlDate = useFormattedBulletinUrlDate(bulletin);

  return (
    <StyledListItemWrapper style={style}>
      <ListItemButton
        LinkComponent={Link}
        href={`/parish-bulletins/${urlDate}`}
        target={openInNewWindow ? '_blank' : undefined}
        rel={openInNewWindow ? 'noopener noreferrer' : undefined}
        selected={selected}
        sx={{
          height: 60,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.1)'
          },
          '&.Mui-selected': {
            backgroundColor: '#bc2f3b',
            '&:hover': {
              backgroundColor: '#cd3744'
            },
            '.MuiListItemText-primary': {
              color: '#fde7a5',
              '&:hover': {
                color: '#ffffff'
              }
            },
            '.MuiListItemText-secondary': {
              color: '#ffffff',
              '&:hover': {
                color: '#ffffff'
              }
            }
          },
          '.MuiListItemText-primary': {
            color: '#444444'
          },
          '.MuiListItemText-secondary': {
            color: '#8D6D26'
          }
        }}
      >
        <ListItemText
          primary={
            <StyledListItemPrimary>
              <div>{date}</div>
            </StyledListItemPrimary>
          }
          secondary={bulletin.name}
          sx={{ margin: 0 }}
        />
      </ListItemButton>
      <IconButton
        href={bulletin.pdf}
        target="_blank"
        onClick={(event) => {
          event.stopPropagation();
        }}
        sx={{
          position: 'absolute',
          right: '14px',
          top: '10px',
          color: selected ? '#ffffff' : undefined,
          '&:hover': {
            color: selected ? '#ffffff' : undefined
          }
        }}
      >
        <DownloadIcon />
      </IconButton>
    </StyledListItemWrapper>
  );
});

BulletListButton.displayName = 'BulletListButton';

export default BulletListButton;
