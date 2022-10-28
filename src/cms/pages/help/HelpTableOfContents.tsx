import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';

import HelpHeadings from './HelpHeadings';

export interface Heading {
  id: string;
  title: string;
}

export interface NestedHeading extends Heading {
  items: Heading[];
}

const getNestedHeadings = (headingElements: HTMLHeadingElement[]) => {
  const nestedHeadings: NestedHeading[] = [];

  headingElements.forEach((heading) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === 'H2') {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === 'H3' && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title
      });
    }
  });

  return nestedHeadings;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState([]);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll<HTMLHeadingElement>('main h2, main h3'));

    // Created a list of headings, with H3s nested
    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

const useIntersectionObserver = (setActiveId: (activeId: string) => void) => {
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});
  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll<HTMLHeadingElement>('h2, h3'));

    if (headingElementsRef.current) {
      headingElementsRef.current = {};
    }

    const callback: IntersectionObserverCallback = (headings) => {
      console.log('intersected headings', headings);
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      // Get all headings that are currently visible on the page
      const visibleHeadings: IntersectionObserverEntry[] = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id: string) => headingElements.findIndex((heading) => heading.id === id);

      // If there is only one visible heading, this is our "active" heading
      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
        // If there is more than one visible heading,
        // choose the one that is closest to the top of the page
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort((a, b) =>
          getIndexFromId(a.target.id) > getIndexFromId(b.target.id) ? 1 : -1
        );

        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -36px 0px'
    });

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [setActiveId]);
};

const StyledNav = styled('nav')`
  width: 240px;
  min-width: 240px;
  padding: 0 16px 16px;
  align-self: flex-start;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 84px;
  max-height: calc(100vh - 70px);
  overflow: auto;
`;

const HelpTableOfContents = () => {
  const [activeId, setActiveId] = useState<string>();
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);
  console.log('activeId', activeId);

  return (
    <StyledNav aria-label="Table of contents">
      <HelpHeadings headings={nestedHeadings} activeId={activeId} />
    </StyledNav>
  );
};

export default HelpTableOfContents;
