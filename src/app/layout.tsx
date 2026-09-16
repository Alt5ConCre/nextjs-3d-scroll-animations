import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

const navigation = [
  ["01", "#section1"],
  ["02", "#section2"],
  ["03", "#section3"],
  ["04", "#section4"],
] as const;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <nav className="cinematic-nav" aria-label="Cinematic chapters">
          <Link href="#" className="cinematic-brand" aria-label="Cinematic Engine home">
            CINEMATIC ENGINE
          </Link>
          <div className="cinematic-nav-links">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
          <span className="cinematic-nav-status">LIVE / WEBGL</span>
        </nav>
        {children}
      </body>
    </html>
  );
}
