import type { GetStaticProps } from "next";

export default function Home() {
  return <div>Home</div>;
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: {} };
};
