import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

interface TagLinkProps {
  tag?: string;
}

const StyledLink = styled('div')`
  color: #bf303c;
  font-size: 15px;
  &:hover {
    color: #822129;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const TagLink = ({ tag }: TagLinkProps) => {
  if (!tag) {
    return null;
  }

  return (
    <Link href={`/posts/tags/${tag}`}>
      <StyledLink>{`#${tag}`}</StyledLink>
    </Link>
  );
};

export default TagLink;
