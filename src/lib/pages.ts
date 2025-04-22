import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { JSON_SCHEMA, load } from 'js-yaml';
import path from 'path';

import type { FileMatter, PageContent, PageContentData } from '../interface';

const pagesDirectory = path.join(process.cwd(), 'content/pages');

let pageMatterCache: FileMatter[];
let pageCache: PageContent[];

export async function fetchPageMatter(): Promise<FileMatter[]> {
  if (pageMatterCache && process.env.NODE_ENV !== 'development') {
    return pageMatterCache;
  }
  // Get file names under /pages
  const fileNames = await readdir(pagesDirectory);
  const allPagesMatter: {
    fileName: string;
    fullPath: string;
    matterResult: matter.GrayMatterFile<string>;
  }[] = [];

  const pageFileNames = fileNames.filter((it) => it.endsWith('.mdx'));

  for (const fileName of pageFileNames) {
    // Read file as string
    const fullPath = path.join(pagesDirectory, fileName);
    const fileContents = await readFile(fullPath, 'utf8');

    // Use gray-matter to parse the page metadata section
    const matterResult = matter(fileContents, {
      engines: {
        yaml: (s) => load(s, { schema: JSON_SCHEMA }) as object
      }
    });
    allPagesMatter.push({ fileName, fullPath, matterResult });
  }

  // Sort pages by date
  pageMatterCache = allPagesMatter.sort((a, b) => {
    if (
      new Date(a.matterResult.data.date as string).getTime() < new Date(b.matterResult.data.date as string).getTime()
    ) {
      return 1;
    } else {
      return -1;
    }
  });

  return pageMatterCache;
}

export async function fetchPageContent(): Promise<PageContent[]> {
  if (pageCache && process.env.NODE_ENV !== 'development') {
    return pageCache;
  }

  const pageMatters = await fetchPageMatter();
  const allPagesData = pageMatters.map(({ fileName: _filename, fullPath, matterResult: { data, content } }) => {
    // TODO Auto generate slugs
    // const slug = fileName.replace(/\.mdx$/, '');
    // Validate slug string
    // if (matterData.slug !== slug) {
    //   throw new Error(`slug field (${slug}) not match with the path of its content source (${matterData.slug})`);
    // }

    const summaryRegex = /<p>([\w\W]+?)<\/p>/i;
    const summaryMatch = summaryRegex.exec(content);

    return {
      fullPath,
      data: data as PageContentData,
      summary: summaryMatch && summaryMatch.length >= 2 ? summaryMatch[1] : content,
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

export async function countPages(tag?: string): Promise<number> {
  const pageContent = await fetchPageContent();
  return pageContent.filter((it) => !tag || (it.data.tags && it.data.tags.includes(tag))).length;
}

export async function listPageContent(page: number, limit: number, tag?: string): Promise<PageContent[]> {
  const pageContent = await fetchPageContent();
  return pageContent
    .filter((it) => !tag || (it.data.tags && it.data.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}
