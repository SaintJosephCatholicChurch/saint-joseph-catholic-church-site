import fs from 'fs';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import path from 'path';

import { SUMMARY_MIN_PARAGRAPH_LENGTH } from '../constants';

import type { FileMatter, PostContent, PostContentData } from '../interface';

const postsDirectory = path.join(process.cwd(), 'content/posts');

let postMatterCache: FileMatter[];
let postCache: PostContent[];

export function fetchPostMatter(): FileMatter[] {
  if (postMatterCache && process.env.NODE_ENV !== 'development') {
    return postMatterCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsMatter = fileNames
    .filter((it) => it.endsWith('.mdx'))
    .map((fileName) => {
      // Read file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
        }
      });
      return { fileName, fullPath, matterResult };
    });

  // Sort posts by date
  postMatterCache = allPostsMatter.sort((a, b) => {
    if (
      new Date(a.matterResult.data.date as string).getTime() < new Date(b.matterResult.data.date as string).getTime()
    ) {
      return 1;
    } else {
      return -1;
    }
  });

  return postMatterCache;
}

export function fetchPostContent(): PostContent[] {
  if (postCache && process.env.NODE_ENV !== 'development') {
    return postCache;
  }

  const allPostsData: PostContent[] = fetchPostMatter().map(
    ({ fileName, fullPath, matterResult: { data, content } }) => {
      const slug = fileName.replace(/\.mdx$/, '');

      const summaryRegex = /^<p>([\w\W]+?)<\/p>/i;
      let summaryMatch = summaryRegex.exec(content);

      const htmlSummaryRegex =
        /^([\s\n]*(?:<(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>(?:[\s\S])*?<\/(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>[\s\n]*){1,2})/i;
      if (!summaryMatch || summaryMatch.length < 2 || summaryMatch[1].length < SUMMARY_MIN_PARAGRAPH_LENGTH) {
        summaryMatch = htmlSummaryRegex.exec(content);
      }

      return {
        fullPath,
        data: {
          ...data,
          slug,
          image: (data.image as string | undefined) ?? '',
          tags: (data.tags as string[] | undefined) ?? []
        } as PostContentData,
        summary: summaryMatch && summaryMatch.length >= 2 ? summaryMatch[1].replace(/<img([\w\W]+?)\/>/g, '') : content,
        content
      };
    }
  );

  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.data.date < b.data.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return postCache;
}

export function countPosts(tag?: string): number {
  return fetchPostContent().filter((post) => !tag || (post.data.tags && post.data.tags.includes(tag))).length;
}

export function listPostContent(page: number, limit: number, tag?: string): PostContent[] {
  return fetchPostContent()
    .filter((post) => !tag || (post.data.tags && post.data.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}
