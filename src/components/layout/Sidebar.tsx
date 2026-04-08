"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { label: "북마크", href: "/bookmarks", icon: "🔖" },
  { label: "할일", href: "/todos", icon: "✅" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 border-r border-[var(--border)] bg-[var(--surface2)] p-4">
      <nav className="flex flex-col gap-1">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              pathname.startsWith(menu.href)
                ? "bg-[var(--accent)] font-medium text-white"
                : "text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)]"
            }`}
          >
            <span>{menu.icon}</span>
            <span>{menu.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
