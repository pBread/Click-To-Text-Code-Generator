import { Header } from "components";
import type { AppProps } from "next/app";
import "../theme/app.less";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className="main">
      <Header className="main-header" />

      <div className="main-content">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
