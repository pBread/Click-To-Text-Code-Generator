import Image from "next/image";
import logo from "public/logo.png";

export function Header({ className }) {
  return (
    <div className={className}>
      <a
        href="https://www.twilio.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image alt="logo" src={logo} height={47} width={47 * (1005 / 305)} />
      </a>

      <div />
    </div>
  );
}
