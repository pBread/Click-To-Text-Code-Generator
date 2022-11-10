import { CopyBlock, dracula } from "react-code-blocks";

const buttonCode = `\
< \
`;

export function CodeBlock({}: {}) {
  return (
    <CopyBlock language="ts" text={buttonCode} theme={dracula} wrapLines />
  );
}
