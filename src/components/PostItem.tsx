import { parseISO } from 'date-fns';
import Link from 'next/link';
import { PostContent } from '../interface';
import Date from './Date';

interface PostItemProps {
  post: PostContent;
}

const PostItem = ({ post }: PostItemProps) => {
  return (
    <Link href={'/posts/' + post.data.slug}>
      <a>
        <Date date={parseISO(post.data.date)} />
        <h2>{post.data.title}</h2>
      </a>
    </Link>
  );
};

export default PostItem;
