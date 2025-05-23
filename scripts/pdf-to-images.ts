// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import git from '@npmcli/git';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PDFExtract } from 'pdf.js-extract';
import webp from 'webp-converter';

import { fetchBulletins } from '../src/lib/bulletins';
// eslint-disable-next-line import/default
import pdfImg from '../src/util/pdf/pdf-img-convert';

import type { PDFExtractOptions } from 'pdf.js-extract';
import type { BulletinPDFMeta } from '../src/interface';

const publicPath = 'public';

interface RegExpReplacement {
  regex: RegExp;
  replacement: string;
}

const COMMON_BULLETIN_ERRORS: RegExpReplacement[] = [
  {
    regex: /(?:^|\s)(P)ar[\s]{1,}ish(?:\s|$)/gi,
    replacement: ' $1arish '
  },
  {
    regex: /(?:^|\s)(S)un[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1unday '
  },
  {
    regex: /(?:^|\s)(S)atur[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1aturday '
  },
  {
    regex: /(?:^|\s)(M)on[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1onday '
  },
  {
    regex: /(?:^|\s)(T)ues[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1uesday '
  },
  {
    regex: /(?:^|\s)(W)ed[\s]{1,}nes[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1ednesday '
  },
  {
    regex: /(?:^|\s)(W)ednes[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1ednesday '
  },
  {
    regex: /(?:^|\s)(T)hurs[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1hursday '
  },
  {
    regex: /(?:^|\s)(F)ri[\s]{1,}day(?:\s|$)/gi,
    replacement: ' $1riday '
  },
  {
    regex: /(?:^|\s)(T)h[\s]{1,}e(?:\s|$)/gi,
    replacement: ' $1he '
  },
  {
    regex: /(?:^|\s)((?!I)[A-Z](?:\s|$)){1,}/g,
    replacement: ' '
  },
  {
    regex: /(?:^|\s)([0-9]{1,})[\s]{1,}(th|rd|st|nd)(?=\s|$)/gi,
    replacement: ' $1$2 '
  },
  {
    regex: /(?:^|\s)([1]*[0-9])([0-5][0-9])[\s]{1,}(am|pm)(?=\s|$)/gi,
    replacement: ' $1:$2$3 '
  },
  {
    regex: /(?:^|\s)([1]*[0-9])[\s]{1,}(am|pm)(?=\s|$)/g,
    replacement: ' $1$2 '
  },
  {
    regex: /(?:^|\s)(\w+)[\s]{1,}(s)(?=\s|$)/g,
    replacement: " $1'$2 "
  },
  {
    regex: /(?:^|\s)([0-9]{3})[\s]{1,}([0-9]{3})[\s]{1,}([0-9]{4})(?=\s|$)/gi,
    replacement: ' <a href="tel:($1)$2-$3">($1)$2-$3</a> '
  },
  {
    regex: /(?:^|\s)([0-9]{3})([0-9]{3})([0-9]{4})(?=\s|$)/gi,
    replacement: ' <a href="tel:($1)$2-$3">($1)$2-$3</a> '
  },
  {
    regex: /(?:^|\s)(?:www)(?:daniels[\s]+jewelers)(?:net)(?=\s|$)/gi,
    replacement: ' <a href="www.daniels-jewelers.net">www.daniels-jewelers.net</a> '
  },
  {
    regex: /(?:^|\s)(www)(\w+)(com|org|edu|net)(?=\s|$)/gi,
    replacement: ' <a href="$1.$2.$3">$1.$2.$3</a> '
  },
  {
    regex: /(?:^|\s)(\w+)(com|org|edu|net)(?=\s|$)/gi,
    replacement: ' <a href="$1.$2">$1.$2</a> '
  },
  {
    regex: /[\s]{2,}/g,
    replacement: ' '
  }
];

const COMMON_CONTRACTIONS: [string, string][] = [
  ['[Aa]ren', 't'],
  ['[Cc]an', 't'],
  ['[Cc]ouldn', 't'],
  ['[Dd]idn', 't'],
  ['[Dd]oesn', 't'],
  ['[Dd]on', 't'],
  ['[Hh]adn', 't'],
  ['[Hh]asn', 't'],
  ['[Hh]aven', 't'],
  ['[Hh]e', 'd'],
  ['[Hh]e', 'll'],
  ['[Ii]', 'd'],
  ['[Ii]', 'll'],
  ['[Ii]', 'm'],
  ['[Ii]', 've'],
  ['[Ii]sn', 't'],
  ['[Mm]ightn', 't'],
  ['[Ss]han', 't'],
  ['[Ss]he', 'd'],
  ['[Ss]he', 'll'],
  ['[Ss]houldn', 't'],
  ['[Tt]hey', 'd'],
  ['[Tt]hey', 'll'],
  ['[Tt]hey', 're'],
  ['[Tt]hey', 've'],
  ['[Ww]e', 'd'],
  ['[Ww]e', 're'],
  ['[Ww]e', 've'],
  ['[Ww]eren', 't'],
  ['[Ww]hat', 'll'],
  ['[Ww]hat', 've'],
  ['[Ww]hat', 're'],
  ['[Ww]ho', 'd'],
  ['[Ww]ho', 'll'],
  ['[Ww]ho', 're'],
  ['[Ww]ho', 've'],
  ['[Ww]on', 't'],
  ['[Ww]ouldn', 't'],
  ['[Yy]ou', 'd'],
  ['[Yy]ou', 'll'],
  ['[Yy]ou', 're'],
  ['[Yy]ou', 've']
];

function fixCommonBulletinErrors(textContent: string) {
  let fixedTextContent = textContent;

  for (const [start, end] of COMMON_CONTRACTIONS) {
    fixedTextContent = fixedTextContent.replace(
      new RegExp(`(?:^|\\s)(${start})[\\s]{1,}(${end})(?=\\s|$)`, 'g'),
      " $1'$2 "
    );
  }

  for (const { regex, replacement } of COMMON_BULLETIN_ERRORS) {
    regex.lastIndex = 0;
    fixedTextContent = fixedTextContent.replace(regex, replacement);
  }

  return fixedTextContent.trim();
}

(async function () {
  await git.spawn(['checkout', 'main']);

  const pdfExtract = new PDFExtract();
  const options: PDFExtractOptions = {
    normalizeWhitespace: true
  };
  let bulletinsProcessed = 0;
  const bulletins = fetchBulletins();
  for (const bulletin of bulletins) {
    const pdfFullPath = join(publicPath, bulletin.pdf);

    const folderPath = bulletin.pdf.replace(/\.pdf$/g, '');
    const folderFullPath = join(publicPath, folderPath);
    if (existsSync(folderFullPath)) {
      continue;
    }

    mkdirSync(folderFullPath);

    const pageImages: string[] = [];
    let textContent = '';

    try {
      const images = await pdfImg.convert(pdfFullPath, {
        width: 1224,
        height: 1584
      });

      for (let i = 0; i < images.length; i++) {
        const imageFullPathJpg = join(folderFullPath, `${i + 1}.jpg`);
        const imageFullPathWebp = join(folderFullPath, `${i + 1}.webp`);

        try {
          writeFileSync(imageFullPathJpg, images[i]);
          await webp.cwebp(imageFullPathJpg, imageFullPathWebp, '-q 80', '-v');
          rmSync(imageFullPathJpg);
          pageImages.push(join(folderPath, `${i + 1}.webp`).replace(/\\/g, '/'));
        } catch (error: unknown) {
          if (error && error instanceof Error) {
            console.error(`Error generating page ${i + 1} image for ${pdfFullPath}: ${error.toString()}`);
          } else {
            console.error(`Unknown error generating page ${i + 1} image for ${pdfFullPath}`);
          }
        }
      }
    } catch (e) {
      console.error('Failed to create images', e);
    }

    try {
      try {
        const pdfData = await pdfExtract.extract(pdfFullPath, options);
        textContent = pdfData.pages
          .map((page) => page.content.map((content) => content.str).join(' '))
          .join(' ')
          .replace(/[ ]{2}/g, ' ')
          .replace(/[^a-z0-9 ]/gi, '');
      } catch (error: unknown) {
        if (error && error instanceof Error) {
          console.error(`Error generating text content for ${pdfFullPath}: ${error.toString()}`);
        } else {
          console.error(`Unknown error generating text content for ${pdfFullPath}`);
        }
        textContent = '';
      }
    } catch (e) {
      console.error('Failed to get text', e);
    }

    const metaFullPath = join(folderFullPath, 'meta.json');
    const data: BulletinPDFMeta = {
      pages: pageImages,
      text: fixCommonBulletinErrors(textContent)
    };

    writeFileSync(metaFullPath, JSON.stringify(data, null, 2));
    bulletinsProcessed++;
  }

  if (bulletinsProcessed === 0) {
    console.info('No new bulletins to process');
  } else {
    console.info(`${bulletinsProcessed} new bulletin${bulletinsProcessed > 1 ? 's' : ''} processed`);
  }

  if (bulletinsProcessed > 0 && process.argv.length > 2 && process.argv[2] === '-ci') {
    console.info('Pushing to github...');
    await git.spawn(['config', 'credential.helper', "'cache --timeout=120'"]);
    await git.spawn(['config', 'user.email', 'lautzd@gmail.com']);
    await git.spawn(['config', 'user.name', 'Circle CI Bot']);
    await git.spawn(['add', '-A']);
    await git.spawn(['commit', '-m', '"Updated bulletins from CI [skip ci]"']);
    await git.spawn(['push', '-q']);
  }
})();
