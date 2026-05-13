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
  const [nestedHeadings, setNestedHeadings] = useState<NestedHeading[]>([]);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll<HTMLHeadingElement>('main h2, main h3'));

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

const useIntersectionObserver = (setActiveId: (activeId: string) => void) => {
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll<HTMLHeadingElement>('main h2, main h3'));

    if (headingElementsRef.current) {
      headingElementsRef.current = {};
    }

    const callback: IntersectionObserverCallback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings: IntersectionObserverEntry[] = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id: string) => headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
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

const StyledNav = styled('nav')(
  ({ theme }) => `
  width: 100%;
  min-width: 0;
  padding: 20px;
  border: 1px solid rgba(127, 35, 44, 0.12);
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(250, 244, 236, 0.96));
  box-shadow: 0 18px 40px rgba(57, 33, 24, 0.08);
  align-self: flex-start;
  position: -webkit-sticky;
  position: sticky;
  top: 20px;

  ${theme.breakpoints.down('lg')} {
    position: static;
    order: -1;
  }
`
);

const StyledTitle = styled('p')`
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #8b5f1c;
`;

const HelpTableOfContents = () => {
  const [activeId, setActiveId] = useState<string>();
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <StyledNav aria-label="Table of contents">
      <StyledTitle>Help Sections</StyledTitle>
      <HelpHeadings headings={nestedHeadings} activeId={activeId} />
    </StyledNav>
  );
};

export default HelpTableOfContents;