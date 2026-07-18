import Image from "next/image";

export function IssuerMark({ issuer, src, alt, size = 48 }: { issuer: string; src?: string; alt?: string; size?: number }) {
  const isLocal = src?.startsWith("/") ?? false;
  return (
    <span className={`issuer-mark${isLocal ? " official" : ""}`} style={{ width: size, height: size }}>
      <span aria-hidden="true">{issuer.slice(0, 2).toUpperCase()}</span>
      {src ? <Image src={src} alt={alt ?? `${issuer} issuer mark`} width={size} height={size} unoptimized={!isLocal} /> : null}
    </span>
  );
}
