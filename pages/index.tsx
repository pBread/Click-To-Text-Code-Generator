import { Typography } from "antd";
import { CodeBlock, InputForm } from "components";
import type { GetStaticProps } from "next";
import { useState } from "react";

const { Title } = Typography;

export default function Home() {
  const [fromNumber, setFromNumber] = useState("");
  const [toNumber, setToNumber] = useState("");
  const [text, setText] = useState("");

  return (
    <>
      <Title>Click to Text</Title>
      <Title level={4}>
        Generate the code you need to allow your customers to simply click and
        text you.
      </Title>
      <InputForm
        fromNumber={fromNumber}
        text={text}
        toNumber={toNumber}
        setFromNumber={setFromNumber}
        setToNumber={setToNumber}
        setText={setText}
      />

      <CodeBlock />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: {} };
};
