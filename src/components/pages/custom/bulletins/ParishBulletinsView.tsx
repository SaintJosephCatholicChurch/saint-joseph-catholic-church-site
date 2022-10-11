/* eslint-disable @next/next/no-img-element */
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { Bulletin, BulletinPDFData } from '../../../../interface';
import { isNotNullish } from '../../../../util/null.util';
import transientOptions from '../../../../util/transientOptions';
import useWindowSize from '../../../../util/useWindowSize';
import PageTitle from '../../PageTitle';
import BulletListButton from './BulletListButton';
import { formatBulletinUrlDate, getFormattedBulletinTitle, useFormattedBulletinTitle } from './util';

const MARGIN_TOP = 215;
const MARGIN_BOTTOM = 36;
const MAX_HEIGHT = 1115;
const MIN_HEIGHT = 558;
const BUTTON_WIDTH = 280;

interface StyledParishBulletinsViewWrapperProps {
  $width: number;
}

const StyledParishBulletinsViewWrapper = styled(
  'div',
  transientOptions
)<StyledParishBulletinsViewWrapperProps>(
  ({ theme, $width }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0;

    ${theme.breakpoints.up('lg')} {
      width: ${$width}px;
      margin: 0 auto;
    }
  `
);

const StyledParishBulletinsView = styled('div')(
  ({ theme }) => `
    display: grid;
    align-items: flex-start;
    margin-top: 16px;

    grid-template-columns: ${BUTTON_WIDTH}px 1fr;
    ${theme.breakpoints.down('lg')} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledSelectWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;

    ${theme.breakpoints.up('lg')} {
      display: none;
    }
  `
);

interface StyledPDFViewerWrapperProps {
  $height: number;
  $width: number;
}

const StyledPDFViewerWrapper = styled(
  'div',
  transientOptions
)<StyledPDFViewerWrapperProps>(
  ({ theme, $height, $width }) => `
    height: auto;
    width: 100%;
    box-sizing: border-box;

    border: 1px solid #e8e5e1;
    ${theme.breakpoints.down('lg')} {
      border: none;
    }

    ${theme.breakpoints.up('lg')} {
      width: ${$width}px;
      &:hover .pdf-pagination {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s linear 0s, opacity 300ms;
      }

      .react-pdf__Document {
        height: ${$height}px;
      }
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

interface StyledPDFViewerContentProps {
  $height: number;
  $width: number;
}

const StyledPDFViewerContent = styled(
  'div',
  transientOptions
)<StyledPDFViewerContentProps>(
  ({ theme, $height, $width }) => `
    height: auto;
    width: 100%;

    ${theme.breakpoints.up('lg')} {
      min-height: ${$height}px;
      width: ${$width}px;
      &:hover .pdf-pagination {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s linear 0s, opacity 300ms;
      }

      .react-pdf__Document {
        height: ${$height}px;
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
  $align: 'left' | 'right';
}

const StyledNavigationButtonWrapper = styled(
  'div',
  transientOptions
)<StyledNavigationButtonWrapperProps>(
  ({ theme, $align }) => `
    display: none;

    ${theme.breakpoints.up('lg')} {
      position: absolute;
      top: 0;
      ${$align}: 0;
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

interface StyledSlidableAreaWrapperProps {
  $height: number;
}

const StyledSlidableAreaWrapper = styled(
  'div',
  transientOptions
)<StyledSlidableAreaWrapperProps>(
  ({ theme, $height }) => `
    display: flex;
    position: relative;
    overflow: auto;
    height: auto;

    ${theme.breakpoints.up('lg')} {
      overflow: hidden;
      height: ${$height}px;
    }
  `
);

interface StyledSlidableAreaProps {
  $width: number;
  $index: number;
}

const StyledSlidableArea = styled(
  'div',
  transientOptions
)<StyledSlidableAreaProps>(
  ({ theme, $width, $index }) => `
    display: flex;
    left: 0;
    transition: left 333ms ease-out;

    ${theme.breakpoints.up('lg')} {
      position: absolute;
      left: -${$width * $index}px;
    }
    
    ${theme.breakpoints.down('lg')} {
      flex-direction: column;
    }
  `
);

const StyledImage = styled('img')(
  ({ theme }) => `
    ${theme.breakpoints.down('lg')} {
      width: 100%;
      height: auto;
    }
  `
);

const BulletinListRowFactory = (bulletin: Bulletin) => {
  const BulletinListRow = (props: ListChildComponentProps<Bulletin[]>) => {
    const { index, style, data } = props;

    return (
      <BulletListButton
        key={`bulletin-${index}`}
        style={style}
        index={index}
        bulletin={data[index]}
        selected={data[index].pdf === bulletin.pdf}
      />
    );
  };

  return BulletinListRow;
};

// TODO Implement virtualization for the select in the future
// const BulletinSelectRow = (props: ListChildComponentProps<Bulletin[]>) => {
//   const { index, style, data } = props;

//   return (
//     <MenuItem style={style} key={`bulletin-menu-item-${index}`} value={data[index].pdf}>
//       {getFormattedBulletinTitle(data[index])}
//     </MenuItem>
//   );
// };

interface ParishBulletinsViewProps {
  bulletins: Bulletin[];
  bulletin: Bulletin;
  meta: BulletinPDFData;
}

const ParishBulletinsView = ({ bulletins, bulletin, meta: { pages } }: ParishBulletinsViewProps) => {
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(0);

  const theme = useTheme();
  const router = useRouter();

  const onBulletinChange = useCallback(
    (pdf: string) => {
      const newBulletin = bulletins.find((aBulletin) => aBulletin.pdf === pdf);
      if (isNotNullish(newBulletin)) {
        router.push(`/parish-bulletins/${formatBulletinUrlDate(newBulletin)}`);
      }
    },
    [bulletins, router]
  );

  useEffect(() => {
    setPage(1);
    setTotalPages(pages.length);
  }, [pages]);

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

  const { height: windowHeight } = useWindowSize();
  const height = Math.min(Math.max((windowHeight ?? 0) - MARGIN_TOP - MARGIN_BOTTOM, MIN_HEIGHT), MAX_HEIGHT);

  useEffect(() => {
    setWidth((height / 11) * 8.5);
  }, [height]);

  const BulletinRow = useMemo(() => BulletinListRowFactory(bulletin), [bulletin]);

  const bulletinMenuItems = useMemo(
    () =>
      bulletins?.map((aBulletin, index) => (
        <MenuItem key={`bulletin-menu-item-${index}`} value={aBulletin.pdf}>
          {getFormattedBulletinTitle(aBulletin)}
        </MenuItem>
      )),
    [bulletins]
  );

  const title = useFormattedBulletinTitle(bulletin);

  return (
    <StyledParishBulletinsViewWrapper $width={width + BUTTON_WIDTH}>
      <PageTitle title="Parish Bulletins" />
      <StyledParishBulletinsView>
        <Box
          sx={{
            backgroundColor: '#e8e5e1',
            [theme.breakpoints.down('lg')]: {
              display: 'none'
            }
          }}
        >
          <FixedSizeList
            height={height}
            width="100%"
            itemSize={60}
            itemCount={bulletins?.length ?? 0}
            overscanCount={5}
            itemData={bulletins ?? []}
          >
            {BulletinRow}
          </FixedSizeList>
        </Box>
        <StyledSelectWrapper>
          <FormControl fullWidth>
            <InputLabel id="bulletin-label">Bulletin</InputLabel>
            <Select
              labelId="bulletin-label"
              id="bulletin"
              value={bulletin.pdf}
              label="Bulletin"
              onChange={(event) => onBulletinChange(event.target.value)}
            >
              {bulletinMenuItems}
            </Select>
          </FormControl>
          <IconButton
            href={bulletin.pdf}
            target="_blank"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <DownloadIcon />
          </IconButton>
        </StyledSelectWrapper>
        <StyledPDFViewerWrapper $width={width} $height={height}>
          <StyledPDFViewer>
            <StyledPDFViewerContent $width={width} $height={height}>
              {pages.length > 0 ? (
                <StyledSlidableAreaWrapper $height={height}>
                  <StyledSlidableArea $width={width} $index={page - 1}>
                    {pages.map((pageImage, index) => (
                      <StyledImage
                        key={`${bulletin.pdf}-page-${index + 1}`}
                        src={pageImage}
                        alt={`${title} - Page ${index + 1}`}
                        width={width}
                        height={height}
                      />
                    ))}
                  </StyledSlidableArea>
                </StyledSlidableAreaWrapper>
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
                <StyledNavigationButtonWrapper $align="left">
                  <Button onClick={onPreviousClick}>
                    <ChevronLeftIcon fontSize="large" />
                  </Button>
                </StyledNavigationButtonWrapper>
              ) : null}
              {page !== totalPages ? (
                <StyledNavigationButtonWrapper $align="right">
                  <Button onClick={onNextClick}>
                    <ChevronRightIcon fontSize="large" />
                  </Button>
                </StyledNavigationButtonWrapper>
              ) : null}
            </StyledPDFViewerContent>
          </StyledPDFViewer>
        </StyledPDFViewerWrapper>
      </StyledParishBulletinsView>
    </StyledParishBulletinsViewWrapper>
  );
};

export default ParishBulletinsView;
