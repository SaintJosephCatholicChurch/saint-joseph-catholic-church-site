import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef } from 'react';

import CalendarEventModalContent from './CalendarEventModalContent';
import useEventDateTimeText from './hooks/useEventDateTimeText';
import useEventTitle from './hooks/useEventTitle';

import type { TransitionProps } from '@mui/material/transitions';
import type { EventClickArg } from '@fullcalendar/react';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CalendarEventDialogProps {
  eventInfo: EventClickArg | null;
  open: boolean;
  onClose: () => void;
}

const CalendarEventDialog = ({ eventInfo, open, onClose }: CalendarEventDialogProps) => {
  const title = useEventTitle(eventInfo?.event.title);
  const [date, time] = useEventDateTimeText(
    eventInfo?.event.start,
    eventInfo?.event.end,
    Boolean(eventInfo?.event.allDay)
  );

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{
        '.MuiToolbar-root': {
          backgroundColor: '#bc2f3b'
        }
      }}
    >
      <AppBar
        sx={{
          backgroundColor: '#bc2f3b',
          position: 'relative'
        }}
      >
        <Toolbar
          sx={{
            paddingRight: '0px!important'
          }}
        >
          <Typography sx={{ flex: 1, p: '4px 0' }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CalendarEventModalContent
        date={date}
        time={time}
        location={eventInfo?.event.extendedProps.location as string | undefined}
        description={eventInfo?.event.extendedProps.description as string | undefined}
      />
    </Dialog>
  );
};

export default CalendarEventDialog;
