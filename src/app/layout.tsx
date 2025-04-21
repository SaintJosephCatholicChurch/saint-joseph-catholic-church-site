import Head from 'next/head';
import { Suspense } from 'react';

import churchDetails from '../lib/church_details';
import { disableReactDevTools } from '../util/devtools.util';

import 'normalize.css';
import '../../public/styles/global.css';

import type { Metadata } from 'next';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

export const metadata: Metadata = {
  manifest: '/manifest.json',
  icons: [
    {
      url: '/favicon.png',
      type: 'image/png',
      sizes: '32x32',
      rel: 'icon'
    },
    {
      url: '/apple-touch-icon.png',
      rel: 'apple-touch-icon'
    }
  ]
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#bc2f3b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="description" content={churchDetails.name} />
      </Head>
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
