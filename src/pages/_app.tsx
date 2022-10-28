import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/timegrid/main.css';
import { useMemo } from 'react';

import 'normalize.css';
import '../../public/styles/global.css';
import { disableReactDevTools } from '../util/devtools.util';

import type { AppProps } from 'next/app';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const App = ({ Component, pageProps }: AppProps) => {
  return useMemo(() => <Component {...pageProps} />, [Component, pageProps]);
};

export default App;
