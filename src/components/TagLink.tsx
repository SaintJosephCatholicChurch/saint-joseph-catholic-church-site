import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { StyledLink } from './common/StyledLink';

const StyledTagLink = styled(StyledLink)`
  font-size: 15px;
`;

interface TagLinkProps {
  tag?: string;
}

const TagLink = ({ tag }: TagLinkProps) => {
  if (!tag) {
    return null;
  }

  return (
    <Link href={`/news/tags/${tag}`}>
      <StyledTagLink>{`#${tag}`}</StyledTagLink>
    </Link>
  );
};

export default TagLink;
