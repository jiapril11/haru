"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const menus = [
  { label: "북마크", href: "/bookmarks", icon: "🔖" },
  { label: "할일", href: "/todos", icon: "✅" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

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
      <div className="border-t border-[var(--border)] p-2">
        <button
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
