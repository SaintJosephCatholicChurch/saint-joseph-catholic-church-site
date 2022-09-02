import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { BulletinPDFMeta } from '../src/interface';
import bulletins from '../src/lib/bulletins';
import pdf2img from '../src/util/pdf/pdf-img-convert';

const publicPath = 'public';

(async function () {
  for (const bulletin of bulletins) {
    const pdfFullPath = join(publicPath, bulletin.pdf);

    const folderPath = bulletin.pdf.replace(/\.pdf$/g, '');
    const folderFullPath = join(publicPath, folderPath);
    if (existsSync(folderFullPath)) {
      continue;
    }

    mkdirSync(folderFullPath);

    const images = await pdf2img.convert(pdfFullPath);

    const pageImages: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const imageFullPath = join(folderFullPath, `${i + 1}.png`);

      try {
        writeFileSync(imageFullPath, images[i]);
        pageImages.push(join(folderPath, `${i + 1}.png`).replace(/\\/g, '/'));
      } catch (error) {
        if (error) {
          console.error(`Error generating page ${i + 1} image for ${pdfFullPath}: ${error}`);
        }
      }
    }

    const metaFullPath = join(folderFullPath, 'meta.json');
    const data: BulletinPDFMeta = {
      pages: pageImages
    };

    writeFileSync(metaFullPath, JSON.stringify(data, null, 2));
  }
})();
