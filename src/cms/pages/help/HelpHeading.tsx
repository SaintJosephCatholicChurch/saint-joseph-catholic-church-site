import { memo } from 'react';

export interface HelpHeadingProps {
  children: string;
  variant: 'h2' | 'h3';
}

const HelpHeading = memo(({ children, variant }: HelpHeadingProps) => {
  const id = children.toLowerCase().replace(/[^a-z0-9]/g, '_');

  return variant === 'h2' ? (
    <h2 key={id} id={id}>
      {children}
    </h2>
  ) : (
    <h3 key={id} id={id}>
      {children}
    </h3>
  );
});

HelpHeading.displayName = 'HelpHeading';

export default HelpHeading;
