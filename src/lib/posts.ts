import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { load, JSON_SCHEMA } from 'js-yaml';
import path from 'path';

import { SUMMARY_MIN_PARAGRAPH_LENGTH } from '../constants';

import type { FileMatter, PostContent, PostContentData } from '../interface';

const postsDirectory = path.join(process.cwd(), 'content/posts');

let postMatterCache: FileMatter[];
let postCache: PostContent[];

export async function fetchPostMatter(): Promise<FileMatter[]> {
  if (postMatterCache && process.env.NODE_ENV !== 'development') {
    return postMatterCache;
  }
  // Get file names under /posts
  const fileNames = await readdir(postsDirectory);
  const postFileNames = fileNames.filter((it) => it.endsWith('.mdx'));

  const allPostsMatter: {
    fileName: string;
    fullPath: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matterResult: matter.GrayMatterFile<any>;
  }[] = [];

  for (const fileName of postFileNames) {
    // Read file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await readFile(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents, {
      engines: {
        yaml: (s) => load(s, { schema: JSON_SCHEMA }) as object
      }
    });
    allPostsMatter.push({ fileName, fullPath, matterResult });
  }

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

export async function fetchPostContent(): Promise<PostContent[]> {
  if (postCache && process.env.NODE_ENV !== 'development') {
    return postCache;
  }

  const posts = await fetchPostMatter();
  const allPostsData: PostContent[] = posts.map(({ fileName, fullPath, matterResult: { data, content } }) => {
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
  });

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

export async function countPosts(tag?: string): Promise<number> {
  const posts = await fetchPostContent();
  return posts.filter((post) => !tag || (post.data.tags && post.data.tags.includes(tag))).length;
}

export async function listPostContent(tag?: string): Promise<PostContent[]> {
  const posts = await fetchPostContent();
  return posts.filter((post) => !tag || (post.data.tags && post.data.tags.includes(tag)));
}
