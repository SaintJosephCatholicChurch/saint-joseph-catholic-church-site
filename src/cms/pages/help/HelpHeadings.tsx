import { styled } from '@mui/material/styles';

import type { NestedHeading } from './HelpTableOfContents';

const StyledList = styled('ul')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const StyledListItem = styled('li')`
  & > a {
    display: block;
    padding: 10px 12px 10px 14px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.96rem;
    line-height: 1.45;
    color: #484b51;
    border-left: 3px solid transparent;
    border-radius: 4px;
    transition:
      color 140ms ease,
      background-color 140ms ease,
      border-color 140ms ease;
  }

  li & > a {
    padding-left: 28px;
    font-size: 0.92rem;
  }

  &.active > a {
    color: #7f232c;
    border-left-color: #7f232c;
    background: rgba(127, 35, 44, 0.06);
  }

  & > a:hover {
    color: #5c1820;
    background: rgba(127, 35, 44, 0.04);
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
