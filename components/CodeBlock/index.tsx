import { CopyBlock, dracula } from "react-code-blocks";

const buttonCode = `\
<a href="sms:+18475070348">Click here to text us!</a>\
`;

export function CodeBlock({}: {}) {
  return (
    <CopyBlock language="html" text={buttonCode} theme={dracula} wrapLines />
  );
}
