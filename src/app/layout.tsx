import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://haru.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Haru — 북마크 & 투두 관리",
    template: "%s | Haru",
  },
  description:
    "중요한 링크와 할일을 한 곳에서 관리하세요. 스마트 북마크와 투두 리스트로 하루를 더 잘 정리하세요.",
  keywords: ["북마크", "투두리스트", "할일관리", "생산성", "링크저장", "Haru"],
  authors: [{ name: "Haru" }],
  creator: "Haru",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "Haru",
    title: "Haru — 북마크 & 투두 관리",
    description:
      "중요한 링크와 할일을 한 곳에서 관리하세요. 스마트 북마크와 투두 리스트로 하루를 더 잘 정리하세요.",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Haru",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Haru — 북마크 & 투두 관리",
    description:
      "중요한 링크와 할일을 한 곳에서 관리하세요.",
    images: ["/icons/icon-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <body className={pretendard.className}>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
