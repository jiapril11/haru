"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallBanner() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [iosGuideOpen, setIosGuideOpen] = useState(false);

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

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
      window.open("/todos", "_blank");
    }
  }

  // 이미 설치됐거나 설치 가능 환경이 아니면 렌더링 안 함
  if (isInstalled || (!installEvent && !isIos)) return null;

  return (
    <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        {/* PWA 배지 */}
        <span className="rounded-full bg-[#e94560]/15 px-2 py-0.5 text-[10px] font-medium text-[#e94560]">
          PWA
        </span>
        <p className="text-sm font-medium text-[var(--text)]">
          앱으로 설치할 수 있어요
        </p>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-[var(--text-subtle)]">
        홈 화면에 추가하면 앱처럼 빠르게 실행할 수 있어요.
      </p>

      {installEvent && (
        <button
          onClick={handleInstall}
          className="w-full rounded-lg bg-(--accent) py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          홈 화면에 추가하기
        </button>
      )}

      {isIos && (
        <>
          <button
            onClick={() => setIosGuideOpen((v) => !v)}
            className="w-full rounded-lg border border-[var(--border)] py-2 text-sm text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
          >
            {iosGuideOpen ? "안내 닫기 ▴" : "설치 방법 보기 ▾"}
          </button>
          {iosGuideOpen && (
            <ol className="mt-3 flex flex-col gap-1.5 text-xs text-[var(--text-subtle)]">
              <li className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-(--accent)">1.</span>
                하단의{" "}
                <span className="inline-flex items-center gap-0.5 font-medium text-[var(--text)]">
                  공유{" "}
                  <svg
                    viewBox="0 0 24 24"
                    className="inline h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>{" "}
                버튼을 탭하세요
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-(--accent)">2.</span>
                <span>
                  <span className="font-medium text-[var(--text)]">
                    홈 화면에 추가
                  </span>
                  를 선택하세요
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-(--accent)">3.</span>
                <span>
                  오른쪽 위{" "}
                  <span className="font-medium text-[var(--text)]">추가</span>를
                  탭하세요
                </span>
              </li>
            </ol>
          )}
        </>
      )}
    </div>
  );
}
