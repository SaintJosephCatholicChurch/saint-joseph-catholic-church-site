import { memo } from 'react';

export interface HelpHeadingLinkProps {
  children: string;
}

const HelpHeadingLink = memo(({ children }: HelpHeadingLinkProps) => {
  const id = children.toLowerCase().replace(/[^a-z0-9]/g, '_');

  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(`#${id}`).scrollIntoView({
          behavior: 'smooth'
        });
      }}
    >
      {children}
    </a>
  );
});

HelpHeadingLink.displayName = 'HelpHeadingLink';

export default HelpHeadingLink;
