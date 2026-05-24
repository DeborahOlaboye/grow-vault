import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GrowVault",
  description: "Save towards your goals. Earn yield while you wait.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="talentapp:project_verification" content="f0a9de69d784ea62a5063ebf67f87b0b276ac1fb0d55a7f70d90b884258c23e9487759958e43ac72bb4884db7efa09c94dd9df97325dac84946a1b7ea50bcc29" />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
