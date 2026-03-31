import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haru",
  description: "북마크와 투두를 한 곳에서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
