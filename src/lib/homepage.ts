import data from '../../content/homepage.json';

import type { HomePageData } from '../interface';

export function normalizePublicAssetPath(assetPath: string): string;
export function normalizePublicAssetPath(assetPath: undefined): undefined;
export function normalizePublicAssetPath(assetPath?: string): string | undefined {
  if (!assetPath) {
    return assetPath;
  }

  const normalizedPath = assetPath.replace(/\\/g, '/');

  if (!normalizedPath.startsWith('/public/') && !normalizedPath.startsWith('public/')) {
    return normalizedPath;
  }

  const publicRelativePath = normalizedPath.replace(/^\/?public(?=\/)/, '');

  return publicRelativePath.startsWith('/') ? publicRelativePath : `/${publicRelativePath}`;
}

export function normalizeHomePageData(homePageData: HomePageData): HomePageData {
  return {
    ...homePageData,
    slides: homePageData.slides.map((slide) => ({
      ...slide,
      image: normalizePublicAssetPath(slide.image)
    })),
    featured: homePageData.featured.map((featuredContent) => {
      if (!featuredContent.image) {
        return featuredContent;
      }

      return {
        ...featuredContent,
        image: normalizePublicAssetPath(featuredContent.image)
      };
    }),
    schedule_section: {
      ...homePageData.schedule_section,
      schedule_background: normalizePublicAssetPath(homePageData.schedule_section.schedule_background)
    },
    daily_readings: {
      ...homePageData.daily_readings,
      daily_readings_background: normalizePublicAssetPath(homePageData.daily_readings.daily_readings_background)
    }
  };
}

export default normalizeHomePageData(data as HomePageData);
