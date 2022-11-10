export function Header({ className }) {
  return (
    <div className={className}>
      <a
        href="https://www.twilio.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          alt="logo"
          src="https://i.imgur.com/3d30tbf.png"
          height={47}
          width={47 * (1005 / 305)}
        />
      </a>

      <div />
    </div>
  );
}
