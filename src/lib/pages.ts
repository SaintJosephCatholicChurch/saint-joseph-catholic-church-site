import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import yaml from 'js-yaml';
import type { FileMatter, PageContent, PageContentData } from '../interface';

const pagesDirectory = path.join(process.cwd(), 'content/pages');

let pageMatterCache: FileMatter[];
let pageCache: PageContent[];

export function fetchPageMatter(): FileMatter[] {
  if (pageMatterCache && process.env.NODE_ENV !== 'development') {
    return pageMatterCache;
  }
  // Get file names under /pages
  const fileNames = fs.readdirSync(pagesDirectory);
  const allPagesMatter = fileNames
    .filter((it) => it.endsWith('.mdx'))
    .map((fileName) => {
      // Read file as string
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
  if (pageCache && process.env.NODE_ENV !== 'development') {
    return pageCache;
  }

  const allPagesData = fetchPageMatter().map(({ fileName, fullPath, matterResult: { data, content } }) => {
    // TODO Auto generate slugs
    // const slug = fileName.replace(/\.mdx$/, '');
    // Validate slug string
    // if (matterData.slug !== slug) {
    //   throw new Error(`slug field (${slug}) not match with the path of its content source (${matterData.slug})`);
    // }

    return {
      fullPath,
      data: data as PageContentData,
      content
    };
  });

  // Sort pages by date
  pageCache = allPagesData.sort((a, b) => {
    if (a.data.date < b.data.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return pageCache;
}

export function countPages(tag?: string): number {
  return fetchPageContent().filter((it) => !tag || (it.data.tags && it.data.tags.includes(tag))).length;
}

export function listPageContent(page: number, limit: number, tag?: string): PageContent[] {
  return fetchPageContent()
    .filter((it) => !tag || (it.data.tags && it.data.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}
