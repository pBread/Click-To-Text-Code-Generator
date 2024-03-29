import { QRCodeCanvas } from "qrcode.react";
import { CopyBlock, dracula } from "react-code-blocks";
import type { State } from "state";
import { makeLink } from "state";

export function CodeBlock(state: State) {
  const smsLink = makeLink(state);

  return (
    <div className="code-block-wrapper">
      <div>
        <QRCodeCanvas value={smsLink} />
      </div>
      <div>
        <a href={smsLink}> Click here to text us! </a>
        <CopyBlock
          language="html"
          text={`<a href="${smsLink}">\n  Click here to text us!\n</a>`}
          theme={dracula}
          wrapLines
        />
      </div>
      <div>
        <button
          onClick={() => {
            window.location.href = smsLink;
          }}
        >
          Click here to text us!
        </button>
        <CopyBlock
          language="html"
          text={`\
<button onclick="window.location.href='${smsLink}';">
  Click here to text us!
</button>\
`}
          theme={dracula}
          wrapLines
        />
      </div>
    </div>
  );
}
