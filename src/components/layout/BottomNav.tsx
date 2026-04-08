"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { label: "북마크", href: "/bookmarks", icon: "🔖" },
  { label: "할일", href: "/todos", icon: "✅" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)] border-t border-[var(--border)] flex items-center md:hidden z-50">
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
            pathname.startsWith(menu.href)
              ? "text-[var(--primary)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          <span className="text-xl">{menu.icon}</span>
          <span className="text-xs font-medium">{menu.label}</span>
        </Link>
      ))}
    </nav>
  );
}
