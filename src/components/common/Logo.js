import Image from "next/image";

export const Logo = ({ className = "" }) => {
  return (
    <Image
      className={`dark:invert ${className}`}
      src="/next.svg"
      alt="Next.js logo"
      width={100}
      height={20}
      priority
    />
  );
};
