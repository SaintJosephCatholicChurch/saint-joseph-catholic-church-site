import PageLayout from '../../components/PageLayout';
import PostListWithFlockNote from '../../components/posts/PostListWithFlockNote';
import config from '../../lib/config';
import homepageData from '../../lib/homepage';
import { fetchPostContent } from '../../lib/posts';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/news';
const title = 'News';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const PostsIndex = async () => {
  const allPosts = await fetchPostContent();

  return (
    <PageLayout url={url} title={title} dailyReadings={homepageData.daily_readings} hideHeader>
      <PostListWithFlockNote allPosts={allPosts} postsPerPage={config.posts_per_page} />
    </PageLayout>
  );
};

export default PostsIndex;
