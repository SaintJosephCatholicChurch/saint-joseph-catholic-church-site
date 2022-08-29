import React from 'react';
import { getAuthor } from '../lib/authors';
import { getTag } from '../lib/tags';
import Author from './Author';
import Date from './Date';
import Layout from './Layout';
import Footer from './layout/footer/Footer';
import BasicMeta from './meta/BasicMeta';
import JsonLdMeta from './meta/JsonLdMeta';
import OpenGraphMeta from './meta/OpenGraphMeta';
import TwitterCardMeta from './meta/TwitterCardMeta';
import TagButton from './TagButton';

interface PostLayoutProps {
  title: string;
  date: Date;
  slug: string;
  tags: string[];
  author: string;
  description?: string;
  children: React.ReactNode;
}

const PostLayout = ({ title, date, slug, author, tags, description = '', children }: PostLayoutProps) => {
  const keywords = tags.map((it) => getTag(it)?.name ?? 'N/A');
  const authorName = getAuthor(author)?.name ?? 'N/A';
  return (
    <Layout>
      <BasicMeta url={`/posts/${slug}`} title={title} keywords={keywords} description={description} />
      <TwitterCardMeta url={`/posts/${slug}`} title={title} description={description} />
      <OpenGraphMeta url={`/posts/${slug}`} title={title} description={description} />
      <JsonLdMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        date={date}
        author={authorName}
        description={description}
      />
      <div>
        <article>
          <header>
            <h1>{title}</h1>
            <div>
              <div>
                <Date date={date} />
              </div>
              <div>
                <Author author={getAuthor(author)} />
              </div>
            </div>
          </header>
          <div className="content">{children}</div>
          <ul>
            {tags.map((it, i) => (
              <li key={i}>
                <TagButton tag={getTag(it)} />
              </li>
            ))}
          </ul>
        </article>
        <Footer />
      </div>
    </Layout>
  );
};

export default PostLayout;
