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
  const [iosGuideOpen, setIosGuideOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isInstalled =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  const isIos =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    /safari/i.test(navigator.userAgent) &&
    !/crios|fxios/i.test(navigator.userAgent);

  useEffect(() => {
    if (isInstalled) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isInstalled]);

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

            {/* PWA 설치 - Chrome/Android */}
            {!isInstalled && installEvent && (
              <button
                onClick={handleInstall}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-(--text-muted) transition-colors hover:bg-(--surface2) hover:text-(--text)"
              >
                <Download size={16} />
                앱 설치
              </button>
            )}

            {/* PWA 설치 - iOS Safari */}
            {!isInstalled && isIos && (
              <>
                <button
                  onClick={() => setIosGuideOpen((v) => !v)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-(--text-muted) transition-colors hover:bg-(--surface2) hover:text-(--text)"
                >
                  <Download size={16} />
                  앱 설치 {iosGuideOpen ? "▴" : "▾"}
                </button>
                {iosGuideOpen && (
                  <ol className="flex flex-col gap-1.5 bg-(--surface2) px-4 py-3 text-xs text-(--text-subtle)">
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-(--primary)">1.</span>
                      하단 공유{" "}
                      <svg viewBox="0 0 24 24" className="inline h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>{" "}
                      버튼 탭
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-(--primary)">2.</span>
                      <span><span className="font-medium text-(--text)">홈 화면에 추가</span> 선택</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-(--primary)">3.</span>
                      <span>오른쪽 위 <span className="font-medium text-(--text)">추가</span> 탭</span>
                    </li>
                  </ol>
                )}
              </>
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
