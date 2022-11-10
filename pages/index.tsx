import { Typography } from "antd";
import { CodeBlock, InputForm } from "components";
import type { GetStaticProps } from "next";
import { useState } from "react";
import type { State } from "state";

const { Title } = Typography;

export default function Home() {
  const [state, setState] = useState<State>({ text: "", toNumber: "" });

  return (
    <>
      <Title>Click to Text</Title>
      <Title level={4}>
        Generate the code you need to allow your customers to simply click and
        text you.
      </Title>
      <InputForm {...state} setState={setState} />

      <CodeBlock />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: {} };
};
