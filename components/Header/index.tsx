import Image from "next/image";
import Link from "next/link";
import logo from "public/logo.png";
import styles from "./style.module.less";

export function Header({ className }) {
  return (
    <div className={`${className} ${styles.wrapper}`}>
      <Link href="/">
        <Image alt="logo" src={logo} height={47} width={47 * (1005 / 305)} />
      </Link>
      <div />
    </div>
  );
}