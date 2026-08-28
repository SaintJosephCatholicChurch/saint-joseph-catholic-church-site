import { memo } from 'react';

import { scrollToHelpHeading } from './scrollToHelpHeading';

export interface HelpHeadingLinkProps {
  children: string;
}

const HelpHeadingLink = memo(({ children }: HelpHeadingLinkProps) => {
  const id = children.toLowerCase().replace(/[^a-z0-9]/g, '_');

  return (
    <a
      href={`#${id}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        scrollToHelpHeading(id);
      }}
    >
      {children}
    </a>
  );
});

HelpHeadingLink.displayName = 'HelpHeadingLink';

export default HelpHeadingLink;