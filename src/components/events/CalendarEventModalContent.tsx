import EventIcon from '@mui/icons-material/Event';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import NotesIcon from '@mui/icons-material/Notes';
import { styled, useTheme } from '@mui/material/styles';

const StyledContentWrapper = styled('div')`
  padding: 16px 28px 24px 16px;
`;

const StyledContent = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 448px;
  width: 100%;
  gap: 16px;
`;

const StyledLine = styled('div')`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const StyledTitleWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 4px;

    ${theme.breakpoints.down('md')} {
      margin-bottom: 8px;
    }
  `
);

const StyledTitle = styled('div')`
  font-size: 22px;
  font-weight: 400;
  line-height: 28px;
  color: #bf303c;
  max-height: 56px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  overflow: hidden;
`;

const StyledDateTime = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 8px;
    font-size: 14px;

    ${theme.breakpoints.down('sm')} {
      flex-direction: column;
    }
  `
);

const StyledDate = styled('div')`
  display: flex;
`;

const StyledDateTimeSeparator = styled('div')(
  ({ theme }) => `
    font-weight: 700;

    ${theme.breakpoints.down('sm')} {
      display: none;
    }
  `
);

const StyledTime = styled('div')`
  display: flex;
`;

const StyledLocation = styled('div')`
  line-height: 1.25em;
`;

const StyledDescription = styled('div')`
  line-height: 1.25em;

  p:first-of-type {
    margin-top: 0;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

interface CalendarEventModalContentProps {
  title?: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
}

const CalendarEventModalContent = ({ title, date, time, location, description }: CalendarEventModalContentProps) => {
  const theme = useTheme();

  return (
    <StyledContentWrapper>
      <StyledContent>
        <StyledLine>
          <EventIcon
            fontSize="small"
            sx={{
              height: '30px',
              [theme.breakpoints.down('md')]: {
                height: 'initial'
              }
            }}
          />
          <StyledTitleWrapper>
            {title ? <StyledTitle>{title}</StyledTitle> : null}
            <StyledDateTime>
              <StyledDate>{date}</StyledDate>
              {time ? (
                <>
                  <StyledDateTimeSeparator>⋅</StyledDateTimeSeparator>
                  <StyledTime>{time}</StyledTime>
                </>
              ) : null}
            </StyledDateTime>
          </StyledTitleWrapper>
        </StyledLine>
        {location ? (
          <StyledLine>
            <LocationOnOutlinedIcon fontSize="small" sx={{ height: '22px' }} />
            <StyledLocation>{location}</StyledLocation>
          </StyledLine>
        ) : null}
        {description ? (
          <StyledLine>
            <NotesIcon fontSize="small" sx={{ height: '22px' }} />
            <StyledDescription
              dangerouslySetInnerHTML={{
                __html: description
              }}
            />
          </StyledLine>
        ) : null}
      </StyledContent>
    </StyledContentWrapper>
  );
};

export default CalendarEventModalContent;
