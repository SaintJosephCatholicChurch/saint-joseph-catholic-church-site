import fs from 'fs';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import path from 'path';
import { FileMatter, PostContent, PostContentData } from '../interface';

const postsDirectory = path.join(process.cwd(), 'content/posts');

let postMatterCache: FileMatter[];
let postCache: PostContent[];

export function fetchPostMatter(): FileMatter[] {
  if (postMatterCache) {
    return postMatterCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsMatter = fileNames
    .filter((it) => it.endsWith('.mdx'))
    .map((fileName) => {
      // Read markdown file as string
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
    if (new Date(a.matterResult.data.date).getTime() < new Date(b.matterResult.data.date).getTime()) {
      return 1;
    } else {
      return -1;
    }
  });

  return postMatterCache;
}

export function fetchPostContent(): PostContent[] {
  if (postCache) {
    return postCache;
  }

  const allPostsData: PostContent[] = fetchPostMatter().map(({ fileName, fullPath, matterResult: { data, content } }) => {
    // TODO Auto generate slugs
    // const slug = fileName.replace(/\.mdx$/, '');
    // if (matterData.slug !== slug) {
    //   throw new Error(`slug field (${slug}) not match with the path of its content source (${matterData.slug})`);
    // }

    const summaryRegex = /^([^\n]+)/g
    const summaryMatch = summaryRegex.exec(content);

    return {
      fullPath,
      data: data as PostContentData,
      summary: summaryMatch && summaryMatch.length >= 2 ? summaryMatch[1] : content,
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

export function countPosts(tag?: string): number {
  return fetchPostContent().filter((post) => !tag || (post.data.tags && post.data.tags.includes(tag))).length;
}

export function listPostContent(page: number, limit: number, tag?: string): PostContent[] {
  return fetchPostContent()
    .filter((post) => !tag || (post.data.tags && post.data.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}
