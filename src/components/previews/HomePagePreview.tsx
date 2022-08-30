import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useMemo, useState } from 'react';
import StyleCopy from '../../cms/StyleCopy';
import { HomePageData, SerializedSlide } from '../../interface';
import times from '../../lib/times';
import HomepageView from '../homepage/HomepageView';

async function entryToSlides(data: HomePageData): Promise<SerializedSlide[]> {
  const slides: SerializedSlide[] = [];
  for (let i = 0; i < data.slides.length; i++) {
    slides.push({
      titleSource: await serialize(data.slides[i].title),
      image: data.slides[i].image
    });
  }

  return slides;
}

const PagePreview = ({ entry, document }: PreviewTemplateComponentProps) => {
  const [slides, setSlides] = useState<SerializedSlide[]>([]);

  const data = useMemo(() => entry.toJS().data as HomePageData, [entry]);

  useEffect(() => {
    let alive = true;

    const getSlides = async () => {
      const newSlides = await entryToSlides(data);
      if (alive) {
        setSlides(newSlides);
      }
    };

    getSlides();

    return () => {
      alive = false;
    };
  }, [data]);

  return useMemo(
    () => (
      <>
        <StyleCopy document={document}>
          <HomepageView slides={slides} homePageData={data} times={times} />
        </StyleCopy>
      </>
    ),
    [data, document, slides]
  );
};
export default PagePreview;
