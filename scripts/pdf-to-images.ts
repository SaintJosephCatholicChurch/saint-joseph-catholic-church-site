import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { BulletinPDFMeta } from '../src/interface';
import bulletins from '../src/lib/bulletins';
import pdf2img from '../src/util/pdf/pdf-img-convert';
import git from '@npmcli/git';

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

    const images = await pdf2img.convert(pdfFullPath, {
      width: 1224,
      height: 1584
    });

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

  if (process.argv.length > 2 && process.argv[2] === '-ci') {
    console.log('Commit to git!');
    await git.spawn(['config', 'credential.helper', "'cache --timeout=120'"]);
    await git.spawn(['config', 'user.email', 'lautzd@gmail.com']);
    await git.spawn(['config', 'user.name', 'Circle CI Bot']);
    await git.spawn(['add', '-A']);
    await git.spawn(['commit', '-m', '"Updated bulletins via CircleCI [skip ci]"']);
    await git.spawn(['push', '-q']);
  }
})();
