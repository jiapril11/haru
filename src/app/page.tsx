import type { Metadata } from "next";
import Link from "next/link";
import PwaInstallBanner from "@/components/PwaInstallBanner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://haru.vercel.app";

export const metadata: Metadata = {
  title: "Haru — 북마크 & 투두 관리",
  description:
    "중요한 링크와 할일을 한 곳에서 관리하세요. 스마트 북마크와 투두 리스트로 하루를 더 잘 정리하세요.",
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Haru",
  url: siteUrl,
  description:
    "중요한 링크와 할일을 한 곳에서 관리하세요. 스마트 북마크와 투두 리스트로 하루를 더 잘 정리하세요.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: ["스마트 북마크 저장", "투두 리스트", "달력 뷰", "드래그 순서 변경"],
};

const features = [
  {
    icon: "🔖",
    title: "스마트 북마크",
    description:
      "URL만 입력하면 제목, 설명, 파비콘을 자동으로 가져옵니다. 태그와 컬렉션으로 깔끔하게 정리하세요.",
  },
  {
    icon: "✅",
    title: "투두 리스트",
    description:
      "오늘, 이번 주, 이번 달 단위로 할일을 관리하세요. 드래그로 순서를 바꾸고 우선순위를 설정할 수 있습니다.",
  },
  {
    icon: "📅",
    title: "달력 뷰",
    description:
      "달력에서 마감일을 한눈에 확인하세요. 날짜를 클릭하면 해당 날의 할일을 바로 볼 수 있습니다.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 네비게이션 */}
      <nav className="flex items-center justify-between border-b border-white/5 px-4 py-4 md:px-8 md:py-5">
        <Link href={"/"} className="text-lg font-bold">
          Haru<span className="text-[#e94560]">.</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-sm text-(--text-muted) transition-colors hover:text-(--text)"
        >
          로그인
        </Link>
      </nav>

      {/* 히어로 */}
      <section className="flex flex-col items-center justify-center px-6 py-16 text-center md:py-32">
        <div className="mb-8 inline-block rounded-full border border-[#e94560]/20 bg-[#e94560]/10 px-3 py-1 text-xs text-[#e94560]">
          북마크 + 투두를 한 곳에서
        </div>

        <h1 className="mb-6 max-w-xl text-3xl font-bold leading-tight md:text-5xl">
          하루를 더 잘
          <br />
          <span className="text-[#e94560]">정리</span>하는 방법
        </h1>

        <p className="mb-10 max-w-md text-lg leading-relaxed text-(--text-subtle)">
          중요한 링크와 할일을 한 곳에서 관리하세요.
          <br />
          저장하고, 계획하고, 실행하세요.
        </p>

        <Link
          href="/auth/login"
          className="rounded-xl bg-[#e94560] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#c73652]"
        >
          무료로 시작하기 →
        </Link>

        <PwaInstallBanner />
      </section>

      {/* 기능 소개 */}
      <section className="mx-auto max-w-4xl px-4 pb-16 md:px-8 md:pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors hover:border-(--border) md:items-center md:text-center"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 font-bold text-(--text)">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-(--text-subtle)">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold">지금 바로 시작해보세요</h2>
        <p className="mb-8 text-sm text-(--text-subtle)">
          가입하고 첫 번째 북마크를 저장해보세요.
        </p>
        <Link
          href="/auth/login"
          className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#0d0d1a] transition-colors hover:bg-white/90"
        >
          시작하기
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-(--text-faint)">
        © 2026 Haru. Built with Next.js & Supabase.
      </footer>
    </div>
  );
}
