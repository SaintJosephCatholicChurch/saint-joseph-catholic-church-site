import 'normalize.css';
import '../../public/styles/global.css';

import config from '../lib/config';

import AppClientBootstrap from './AppClientBootstrap';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: config.site_title,
  description: config.site_description,
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: '#bc2f3b'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" style={{ minHeight: '100vh' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ minHeight: '100vh' }}>
        <AppClientBootstrap />
        {children}
      </body>
    </html>
  );
}
