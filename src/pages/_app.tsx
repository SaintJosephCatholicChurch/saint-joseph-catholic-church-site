import 'normalize.css';
import { AppProps } from 'next/app';
// NOTE: Do not move the styles dir to the src.
// They are used by the Netlify CMS preview feature.
import '../../public/styles/global.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Saint Joseph Catholic Church" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
