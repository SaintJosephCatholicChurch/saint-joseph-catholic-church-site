import { styled } from '@mui/material/styles';

import type { NestedHeading } from './HelpTableOfContents';

const StyledList = styled('ul')`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
`;

const StyledListItem = styled('li')`
  & > a {
    padding-left: 16px;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    border-left: 1px solid transparent;
  }

  li & > a {
    padding-left: 32px;
  }

  &.active > a {
    color: #bf303c;
    border-left: 1px solid #bf303c;
  }

  & > a:hover {
    color: #822129;
  }
`;

interface HelpHeadingsProps {
  headings: NestedHeading[];
  activeId: string | undefined;
}

const HelpHeadings = ({ headings, activeId }: HelpHeadingsProps) => (
  <StyledList>
    {headings.map((heading) => (
      <StyledListItem key={heading.id} className={heading.id === activeId ? 'active' : ''}>
        <a
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(`#${heading.id}`).scrollIntoView({
              behavior: 'smooth'
            });
          }}
        >
          {heading.title}
        </a>
        {heading.items.length > 0 && (
          <StyledList>
            {heading.items.map((child) => (
              <StyledListItem key={child.id} className={child.id === activeId ? 'active' : ''}>
                <a
                  href={`#${child.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${child.id}`).scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  {child.title}
                </a>
              </StyledListItem>
            ))}
          </StyledList>
        )}
      </StyledListItem>
    ))}
  </StyledList>
);

export default HelpHeadings;
