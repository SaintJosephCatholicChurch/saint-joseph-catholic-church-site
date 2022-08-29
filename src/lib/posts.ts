import fs from 'fs';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import path from 'path';
import { FileMatter } from '../interface';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostContent {
  readonly date: string;
  readonly title: string;
  readonly slug: string;
  readonly tags?: string[];
  readonly fullPath: string;
};

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

  const allPostsData = fetchPostMatter().map(({ fileName, fullPath, matterResult }) => {
    const matterData = matterResult.data as {
      date: string;
      title: string;
      tags: string[];
      slug: string;
      fullPath: string;
    };
    matterData.fullPath = fullPath;

    const slug = fileName.replace(/\.mdx$/, '');

    // Validate slug string
    if (matterData.slug !== slug) {
      throw new Error(`slug field (${slug}) not match with the path of its content source (${matterData.slug})`);
    }

    return matterData;
  });

  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return postCache;
}

export function countPosts(tag?: string): number {
  return fetchPostContent().filter((it) => !tag || (it.tags && it.tags.includes(tag))).length;
}

export function listPostContent(page: number, limit: number, tag?: string): PostContent[] {
  return fetchPostContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}
