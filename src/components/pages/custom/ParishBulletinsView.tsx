import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import format from 'date-fns/format';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Bulletin } from '../../../interface';
import styled from '../../../util/styled.util';
import useElementSize from '../../../util/useElementSize';

const StyledParishBulletinsView = styled('div')(
  ({ theme }) => `
    display: grid;
    align-items: flex-start;
    grid-template-columns: 1fr 3fr;
    ${theme.breakpoints.down('lg')} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledPDFViewerWrapper = styled('div')(
  ({ theme }) => `
    width: 100%;
    box-sizing: border-box;

    border: 1px solid #e8e5e1;
    ${theme.breakpoints.down('lg')} {
      border: none;
    }
  `
);

const StyledPDFViewer = styled('div')`
  width: 100%;
  position: relative;

  .react-pdf__Page {
    display: flex;
  }
`;

const StyledLoaderMessage = styled('div')`
  text-align: center;
  font-size: 20px;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  font-weight: 500;
  margin-top: 24px;
`;

interface StyledPDFViewerContentProps {
  height: number;
  width: number;
}

const StyledPDFViewerContent = styled('div', ['width', 'height'])<StyledPDFViewerContentProps>(
  ({ theme, height, width }) => `
    min-height: ${height}px;
    height: auto;
    width: ${width}px;

    ${theme.breakpoints.up('lg')} {
      &:hover .pdf-pagination {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s linear 0s, opacity 300ms;
      }

      .react-pdf__Document {
        height: ${height}px;
      }
    }
  `
);

const StyledPaginationContainer = styled('div')(
  ({ theme }) => `
    display: none;

    ${theme.breakpoints.up('lg')} {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 16px;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s linear 300ms, opacity 300ms;
    }
  `
);

const StyledFloatingPagination = styled('div')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 0;
  padding: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  color: inherit;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  min-height: auto;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 24px;
  padding: 0 8px;
  min-width: 48px;
  width: auto;
  height: 48px;
  z-index: 1050;
  color: rgba(0, 0, 0, 0.87);
  background-color: #e0e0e0;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);

  .MuiPaginationItem-page.Mui-selected {
    background-color: #bc2f3b;
    color: #ffffff;
  }

  .MuiPaginationItem-page.Mui-selected:hover {
    background-color: #93252e;
  }

  .MuiPaginationItem-page:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

interface StyledNavigationButtonWrapperProps {
  align: 'left' | 'right';
}

const StyledNavigationButtonWrapper = styled('div', ['align'])<StyledNavigationButtonWrapperProps>(
  ({ theme, align }) => `
    display: none;

    ${theme.breakpoints.up('lg')} {
      position: absolute;
      top: 0;
      ${align}: 0;
      bottom: 0;
      min-width: 40px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: -1px;
      z-index: 1050;
      cursor: pointer;

      .MuiButton-root {
        color: #ffffff;
        height: 100%;
        width: 100%;
        min-width: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        border-radius: 0;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s linear 300ms, opacity 300ms;

        &:hover {
          background-color: rgba(0, 0, 0, 0.25);
        }

        .MuiSvgIcon-root {
          width: 1.25em;
          height: 1.25em;
        }
      }

      &:hover .MuiButton-root {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s linear 0s, opacity 300ms;
      }
    }
  `
);

const StyledSlidableAreaWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    position: relative;
    height: 100%;
    overflow: hidden;

    ${theme.breakpoints.down('lg')} {
      overflow: auto;
    }
  `
);

interface StyledSlidableAreaProps {
  width: number;
  index: number;
}

const StyledSlidableArea = styled('div')<StyledSlidableAreaProps>(
  ({ theme, width, index }) => `
    display: flex;
    left: 0;
    transition: left 333ms ease-out;

    ${theme.breakpoints.up('lg')} {
      position: absolute;
      left: -${width * index}px;
    }
    
    ${theme.breakpoints.down('lg')} {
      flex-direction: column;
    }
  `
);

interface ParishBulletinsView {
  bulletins: Bulletin[];
}

const ParishBulletinsView = ({ bulletins }: ParishBulletinsView) => {
  const [bulletinIndex, setBulletinIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [height, setHeight] = useState(0);

  const theme = useTheme();

  const onBulletinChange = useCallback(
    (index: number) => () => {
      setBulletinIndex(index);
      setPage(1);
    },
    []
  );

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setPage(1);
  }, []);

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage <= 0 || newPage > totalPages) {
        return;
      }
      setPage(newPage);
    },
    [totalPages]
  );

  const handlePaginationChange = useCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => {
      onPageChange(value);
    },
    [onPageChange]
  );

  const onPreviousClick = useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const onNextClick = useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

  const [topRef, { width: topWidth }] = useElementSize();
  const [pdfRef, { width: pdfWidth }] = useElementSize();
  const width = useMemo(() => Math.min(topWidth, pdfWidth), [pdfWidth, topWidth]);

  useEffect(() => {
    setHeight((width / 8.5) * 11);
  }, [width]);

  const bulletinListItems = useMemo(
    () =>
      bulletins?.map((bulletin, index) => (
        <ListItemButton
          key={`bulletin-${index}`}
          selected={index === bulletinIndex}
          onClick={onBulletinChange(index)}
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
          <ListItemText primary={`${format(new Date(bulletin.date), 'MMM dd, yyyy')} - ${bulletin.name}`} />
        </ListItemButton>
      )),
    [bulletinIndex, bulletins, onBulletinChange]
  );

  const bulletinMenuItems = useMemo(
    () =>
      bulletins?.map((bulletin, index) => (
        <MenuItem key={`bulletin-menu-item-${index}`} value={index}>
          {format(new Date(bulletin.date), 'MMM dd, yyyy')} - {bulletin.name}
        </MenuItem>
      )),
    [bulletins]
  );

  const bulletinPDF = useMemo(
    () => (bulletins.length > bulletinIndex ? bulletins[bulletinIndex].pdf : null),
    [bulletinIndex, bulletins]
  );

  return (
    <StyledParishBulletinsView ref={topRef}>
      <List
        sx={{
          backgroundColor: '#e8e5e1',
          [theme.breakpoints.down('lg')]: {
            display: 'none'
          }
        }}
        disablePadding
      >
        {bulletinListItems}
      </List>
      <FormControl
        sx={{
          [theme.breakpoints.up('lg')]: {
            display: 'none'
          },
          mb: 3
        }}
        fullWidth
      >
        <InputLabel id="bulletin-label">Bulletin</InputLabel>
        <Select
          labelId="bulletin-label"
          id="bulletin"
          value={bulletinIndex}
          label="Bulletin"
          onChange={(event) => {
            const rawValue = +event.target.value;
            console.log(rawValue);
            if (!Number.isNaN(rawValue)) {
              onBulletinChange(rawValue)();
            }
          }}
        >
          {bulletinMenuItems}
        </Select>
      </FormControl>
      <StyledPDFViewerWrapper>
        <StyledPDFViewer ref={pdfRef}>
          <StyledPDFViewerContent width={width} height={height}>
            {bulletinPDF !== null ? (
              <Document
                file={bulletinPDF}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<StyledLoaderMessage>Loading bulletin...</StyledLoaderMessage>}
                noData={<StyledLoaderMessage>Could not find bulletin.</StyledLoaderMessage>}
                error={<StyledLoaderMessage>Could not load bulletin.</StyledLoaderMessage>}
              >
                <StyledSlidableAreaWrapper>
                  <StyledSlidableArea width={width} index={page - 1}>
                    {[...Array(totalPages)].map((_, index) => (
                      <Page
                        key={`bulletin-${bulletinIndex}-page-${index}`}
                        pageNumber={index + 1}
                        width={width}
                        height={height}
                        renderAnnotationLayer={false}
                        loading={false}
                        noData={false}
                        error={false}
                      />
                    ))}
                  </StyledSlidableArea>
                </StyledSlidableAreaWrapper>
              </Document>
            ) : null}
            <StyledPaginationContainer className="pdf-pagination">
              <StyledFloatingPagination aria-label="pagination">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePaginationChange}
                  hidePrevButton
                  hideNextButton
                />
              </StyledFloatingPagination>
            </StyledPaginationContainer>
            {page !== 1 ? (
              <StyledNavigationButtonWrapper align="left">
                <Button onClick={onPreviousClick}>
                  <ChevronLeftIcon fontSize="large" />
                </Button>
              </StyledNavigationButtonWrapper>
            ) : null}
            {page !== totalPages ? (
              <StyledNavigationButtonWrapper align="right">
                <Button onClick={onNextClick}>
                  <ChevronRightIcon fontSize="large" />
                </Button>
              </StyledNavigationButtonWrapper>
            ) : null}
          </StyledPDFViewerContent>
        </StyledPDFViewer>
      </StyledPDFViewerWrapper>
    </StyledParishBulletinsView>
  );
};

export default ParishBulletinsView;
