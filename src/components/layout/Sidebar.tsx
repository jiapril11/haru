"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const menus = [
  { label: "할일", href: "/todos", icon: "✅" },
  { label: "북마크", href: "/bookmarks", icon: "🔖" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const isInstalled =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

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

  const showInstall = !isInstalled && !!installEvent;

  return (
    <aside
      className={`fixed top-14 left-0 hidden h-[calc(100vh-3.5rem)] flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--surface2)] transition-[width] duration-300 md:flex ${
        isCollapsed ? "w-14" : "w-56"
      }`}
    >
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            title={isCollapsed ? menu.label : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              pathname.startsWith(menu.href)
                ? "bg-[var(--accent)] font-medium text-white"
                : "text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)]"
            }`}
          >
            <span className="shrink-0">{menu.icon}</span>
            {!isCollapsed && <span>{menu.label}</span>}
          </Link>
        ))}
      </nav>

      {/* PWA 설치 버튼 */}
      {showInstall && (
        <div className="border-t border-[var(--border)] p-2">
          {isCollapsed ? (
            <button
              onClick={handleInstall}
              title="앱 설치"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]"
            >
              <Download size={16} />
            </button>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="mb-1 text-xs font-medium text-[var(--text)]">앱으로 설치하기</p>
              <p className="mb-2.5 text-[11px] text-[var(--text-faint)]">
                홈 화면에 추가하면 더 빠르게 실행할 수 있어요.
              </p>
              <button
                onClick={handleInstall}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-(--accent) py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
              >
                <Download size={12} />
                설치
              </button>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-[var(--border)] p-2">
        <button
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]"
        >
          {isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <span className="flex items-center gap-1.5 text-xs">
              <ChevronLeft size={16} />
              접기
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
