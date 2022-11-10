import type { GetStaticProps } from "next";
import { CodeBlock } from "components";

export default function Home() {
  return (
    <div>
      <CodeBlock />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: {} };
};
