import { Header } from "components";
import { useNextRedux } from "next-redux";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { getOrMakeStore } from "state";
import "../theme/app.less";

export default function App({ Component, pageProps, router }: AppProps) {
  const store = getOrMakeStore(pageProps.preloadedState);
  useNextRedux(store, { pageProps, router });

  return (
    <Provider store={store}>
      <Main Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

function Main({ Component, pageProps }) {
  return (
    <div className="main">
      <Header className="main-header" />

      <div className="main-content">
        <Component {...pageProps} />;
      </div>
    </div>
  );
}
