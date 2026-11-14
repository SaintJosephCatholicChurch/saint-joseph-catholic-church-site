import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

import type { MassOrientation } from '../../interface';

interface MassOrientationBadgeProps {
  orientation?: MassOrientation;
}

export default function MassOrientationBadge({ orientation = 'versus_populum' }: MassOrientationBadgeProps) {
  const [open, setOpen] = useState(false);
  if (orientation === '') {
    return null;
  }

  const adOrientem = orientation === 'ad_orientem';
  const name = adOrientem ? 'ad orientem' : 'versus populum';

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={`Mass offered: ${name}`}
        describeChild
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableTouchListener
      >
        <Chip
          component="button"
          type="button"
          label={adOrientem ? 'a.o.' : 'v.p.'}
          aria-label={`Mass orientation: ${name}`}
          size="small"
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            height: 24,
            fontSize: '11px',
            fontWeight: 400,
            textTransform: 'none',
            color: '#bc2f3b',
            borderColor: 'rgba(188, 47, 59, 0.4)',
            flexShrink: 0,
            '& .MuiChip-label': {
              transform: 'translateY(1px)'
            }
          }}
        />
      </Tooltip>
    </ClickAwayListener>
  );
}
