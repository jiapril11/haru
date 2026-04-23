"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Gnb() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (isInstalled) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
      setMenuOpen(false);
      window.open("/todos", "_blank");
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-(--border) bg-(--surface) px-4">
      <span className="text-lg font-bold tracking-tight text-(--text)">
        Haru<span className="text-(--primary)">.</span>
      </span>

      {/* 데스크탑 */}
      <div className="hidden items-center gap-3 md:flex">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer text-lg text-(--text-muted) transition-colors hover:text-(--text)"
            title={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="cursor-pointer text-sm text-(--text-muted) transition-colors hover:text-(--text)"
        >
          로그아웃
        </button>
      </div>

      {/* 모바일 햄버거 */}
      <div className="relative md:hidden" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="cursor-pointer p-1 text-(--text-muted) transition-colors hover:text-(--text)"
          aria-label="메뉴"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOpen && (
          <div className="absolute top-10 right-0 z-50 min-w-44 overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-lg">
            {/* 다크모드 토글 */}
            {mounted && (
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setMenuOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-(--text-muted) transition-colors hover:bg-(--surface2) hover:text-(--text)"
              >
                <span className="text-base">{theme === "dark" ? "☀️" : "🌙"}</span>
                {theme === "dark" ? "라이트 모드" : "다크 모드"}
              </button>
            )}

            {/* PWA 설치 */}
            {installEvent && (
              <button
                onClick={handleInstall}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-(--text-muted) transition-colors hover:bg-(--surface2) hover:text-(--text)"
              >
                <Download size={16} />
                앱 설치
              </button>
            )}

            {/* 구분선 */}
            <div className="border-t border-(--border)" />

            {/* 로그아웃 */}
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-(--text-muted) transition-colors hover:bg-(--surface2) hover:text-(--text)"
            >
              <span className="text-base">🚪</span>
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
