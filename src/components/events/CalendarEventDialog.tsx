import type { EventClickArg } from '@fullcalendar/react';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import type { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import { forwardRef } from 'react';
import CalendarEventModalContent from './CalendarEventModalContent';
import useEventDateTimeText from './hooks/useEventDateTimeText';
import useEventTitle from './hooks/useEventTitle';

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
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
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
        location={eventInfo?.event.extendedProps.location}
        description={eventInfo?.event.extendedProps.description}
      />
    </Dialog>
  );
};

export default CalendarEventDialog;
