import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import yaml from 'js-yaml';
import { FileMatter } from '../interface';

const pagesDirectory = path.join(process.cwd(), 'content/pages');

export type PageContent = {
  readonly date: string;
  readonly title: string;
  readonly slug: string;
  readonly tags?: string[];
  readonly fullPath: string;
};

let pageMatterCache: FileMatter[];
let pageCache: PageContent[];

export function fetchPageMatter(): FileMatter[] {
  if (pageMatterCache) {
    return pageMatterCache;
  }
  // Get file names under /pages
  const fileNames = fs.readdirSync(pagesDirectory);
  const allPagesMatter = fileNames
    .filter((it) => it.endsWith('.mdx'))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(pagesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the page metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
        }
      });
      return { fileName, fullPath, matterResult };
    });

  // Sort pages by date
  pageMatterCache = allPagesMatter.sort((a, b) => {
    if (new Date(a.matterResult.data.date).getTime() < new Date(b.matterResult.data.date).getTime()) {
      return 1;
    } else {
      return -1;
    }
  });

  return pageMatterCache;
}

export function fetchPageContent(): PageContent[] {
  if (pageCache) {
    return pageCache;
  }

  const allPagesData = fetchPageMatter().map(({ fileName, fullPath, matterResult }) => {
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

  // Sort pages by date
  pageCache = allPagesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return pageCache;
}

export function countPages(tag?: string): number {
  return fetchPageContent().filter((it) => !tag || (it.tags && it.tags.includes(tag))).length;
}

export function listPageContent(page: number, limit: number, tag?: string): PageContent[] {
  return fetchPageContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}
