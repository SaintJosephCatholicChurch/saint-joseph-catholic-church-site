import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import { formatAsUtc } from '../../../util/date.util';
import useEventTitle from '../hooks/useEventTitle';

import type { MouseEvent } from 'react';
import type { EventRenderRange } from '@fullcalendar/react';

const StyledMobileEvent = styled('div')`
  display: grid;
  grid-template-columns: 80px auto;
  width: 100%;
  align-items: flex-start;
  gap: 12px;
`;

const StyledMobileEventTime = styled('div')`
  justify-content: flex-end;

  .MuiChip-root {
    background-color: #bc2f3b;
    color: #ffffff;
    font-size: 14px;
    width: 100%;

    .MuiChip-label {
      padding: 0 6px;
    }
  }
`;

const StyledMobileEventBody = styled('div')`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const StyledMobileEventTitle = styled('h3')`
  margin: 0;
  font-size: 16px;
  font-weight: 500px;
  display: flex;
  color: #333;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-transform: none;
`;

const StyledMobileEventLocation = styled('div')`
  font-size: 14px;
  color: #222;
  text-align: left;
  text-transform: none;
`;

interface MobileListEventProps {
  segment: EventRenderRange;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const MobileListEvent = ({ segment, onClick }: MobileListEventProps) => {
  const time = useMemo(() => {
    if (segment.def.allDay) {
      return 'All Day';
    }

    if (segment.isStart) {
      return formatAsUtc(segment.range.start, 'h:mmaaa');
    }

    return `Till ${formatAsUtc(segment.range.end, 'h:mmaaa')}`;
  }, [segment.def.allDay, segment.isStart, segment.range.end, segment.range.start]);

  const title = useEventTitle(segment.def.title);

  return (
    <Button onClick={onClick} sx={{ p: '8px', m: '0 -8px' }}>
      <StyledMobileEvent>
        <StyledMobileEventTime>
          <Chip label={time} />
        </StyledMobileEventTime>
        <StyledMobileEventBody>
          <StyledMobileEventTitle>{title}</StyledMobileEventTitle>
          {segment.def.extendedProps.location ? (
            <StyledMobileEventLocation>{segment.def.extendedProps.location}</StyledMobileEventLocation>
          ) : null}
        </StyledMobileEventBody>
      </StyledMobileEvent>
    </Button>
  );
};

export default MobileListEvent;
