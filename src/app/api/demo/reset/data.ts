export const SAMPLE_TODOS = [
  {
    title: "포트폴리오 사이트 업데이트",
    is_done: false,
    priority: "high",
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    start_date: null,
    sort_order: 0,
  },
  {
    title: "운동 30분",
    is_done: true,
    priority: "medium",
    due_date: new Date().toISOString().slice(0, 10),
    start_date: null,
    sort_order: 1,
  },
  {
    title: "책 읽기",
    is_done: false,
    priority: "low",
    due_date: new Date().toISOString().slice(0, 10),
    start_date: null,
    sort_order: 2,
  },
  {
    title: "Next.js 공식 문서 정독",
    is_done: false,
    priority: "high",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    start_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    sort_order: 3,
  },
  {
    title: "Supabase RLS 정책 점검",
    is_done: false,
    priority: "medium",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    start_date: null,
    sort_order: 4,
  },
  {
    title: "주간 회고 작성",
    is_done: false,
    priority: "low",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    start_date: null,
    sort_order: 5,
  },
  {
    title: "이메일 확인 및 답장",
    is_done: true,
    priority: "medium",
    due_date: new Date().toISOString().slice(0, 10),
    start_date: null,
    sort_order: 6,
  },
];

export const SAMPLE_BOOKMARKS = [
  {
    url: "https://tadadadacoding.com",
    title: "타다다 코딩",
    description: "개발 블로그",
    favicon_url: "https://tadadadacoding.com/favicon.ico",
    tags: ["블로그"],
    is_favorite: true,
  },
  {
    url: "https://nextjs.org/docs",
    title: "Next.js 공식 문서",
    description: "Next.js의 모든 기능을 다루는 공식 레퍼런스",
    favicon_url: "https://nextjs.org/favicon.ico",
    tags: ["개발", "Next.js"],
    is_favorite: true,
  },
  {
    url: "https://supabase.com/docs",
    title: "Supabase Docs",
    description: "오픈소스 Firebase 대안 — Postgres 기반 백엔드",
    favicon_url: "https://supabase.com/favicon/favicon-32x32.png",
    tags: ["개발", "백엔드"],
    is_favorite: false,
  },
  {
    url: "https://tailwindcss.com/docs",
    title: "Tailwind CSS",
    description: "유틸리티 퍼스트 CSS 프레임워크 공식 문서",
    favicon_url: "https://tailwindcss.com/favicons/favicon-32x32.png",
    tags: ["디자인", "CSS"],
    is_favorite: true,
  },
  {
    url: "https://ui.shadcn.com",
    title: "shadcn/ui",
    description: "재사용 가능한 UI 컴포넌트 모음",
    favicon_url: "https://ui.shadcn.com/favicon.ico",
    tags: ["디자인", "컴포넌트"],
    is_favorite: false,
  },
  {
    url: "https://react-query.tanstack.com",
    title: "TanStack Query",
    description: "강력한 비동기 상태 관리 라이브러리",
    favicon_url: "https://tanstack.com/favicon.ico",
    tags: ["개발", "React"],
    is_favorite: false,
  },
  {
    url: "https://www.typescriptlang.org/docs",
    title: "TypeScript Handbook",
    description: "TypeScript 공식 핸드북",
    favicon_url: "https://www.typescriptlang.org/favicon-32x32.png",
    tags: ["개발", "TypeScript"],
    is_favorite: true,
  },
];
