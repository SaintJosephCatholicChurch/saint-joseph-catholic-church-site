import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { memo } from 'react';
import type { Bulletin } from '../../../../interface';
import { useFormattedBulletinTitle, useFormattedBulletinUrlDate } from './util';

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
}

const BulletListButton = memo(({ bulletin, selected, openInNewWindow = false }: BulletListButtonProps) => {
  const title = useFormattedBulletinTitle(bulletin);
  const urlDate = useFormattedBulletinUrlDate(bulletin);

  return (
    <StyledListItemWrapper>
      <ListItemButton
        selected={selected}
        href={`/parish-bulletins/${urlDate}`}
        target={openInNewWindow ? '_blank' : undefined}
        sx={{
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
            }
          },
          '.MuiListItemText-primary': {
            color: '#444444'
          }
        }}
      >
        <ListItemText
          primary={
            <StyledListItemPrimary>
              <div>{title}</div>
            </StyledListItemPrimary>
          }
        />
      </ListItemButton>
      <IconButton
        href={bulletin.pdf}
        target="_blank"
        onClick={(event) => {
          event.stopPropagation();
        }}
        sx={{ position: 'absolute', right: '16px', top: '4px', color: selected ? '#ffffff' : undefined }}
      >
        <DownloadIcon />
      </IconButton>
    </StyledListItemWrapper>
  );
});

BulletListButton.displayName = 'BulletListButton';

export default BulletListButton;
