import { Suspense } from 'react';

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
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
