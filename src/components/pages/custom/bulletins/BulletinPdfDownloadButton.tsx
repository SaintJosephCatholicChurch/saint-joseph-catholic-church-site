import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { getBulletinPdfFileName, getBulletinPdfPaths } from './util';

import type { MouseEvent } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Bulletin } from '../../../../interface';

interface BulletinPdfDownloadButtonProps {
  bulletin: Bulletin;
  sx?: SxProps<Theme>;
}

const BulletinPdfDownloadButton = ({ bulletin, sx }: BulletinPdfDownloadButtonProps) => {
  const pdfs = getBulletinPdfPaths(bulletin);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (pdfs.length === 0) {
    return null;
  }

  if (pdfs.length === 1) {
    return (
      <IconButton
        href={pdfs[0]}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          event.stopPropagation();
        }}
        sx={sx}
      >
        <DownloadIcon />
      </IconButton>
    );
  }

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        aria-label="Download bulletin PDFs"
        onClick={handleOpen}
        sx={sx}
      >
        <DownloadIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClick={(event) => event.stopPropagation()}
        onClose={() => setAnchorEl(null)}
      >
        {pdfs.map((pdfPath) => (
          <MenuItem
            key={pdfPath}
            component="a"
            href={pdfPath}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => setAnchorEl(null)}
          >
            {getBulletinPdfFileName(pdfPath)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default BulletinPdfDownloadButton;
