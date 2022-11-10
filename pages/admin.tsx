import type { GetStaticProps } from "next";

export default function Admin() {
  return <div>Admin</div>;
}

export const getStaticProps: GetStaticProps = (ctx) => {
  return { props: {} };
};
