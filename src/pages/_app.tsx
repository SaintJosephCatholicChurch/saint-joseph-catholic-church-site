import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/timegrid/main.css';
import { AppProps } from 'next/app';
import 'normalize.css';
import '../../public/styles/global.css';

if (process.env.NODE_ENV == 'production') {
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
}

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
