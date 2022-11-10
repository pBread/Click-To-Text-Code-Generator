import "antd/dist/antd.css";
import { Header } from "components";
import type { AppProps } from "next/app";
import "../theme/app.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="main">
      <Header className="main-header" />

      <div className="main-content">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
