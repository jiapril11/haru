"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";

const menus = [
  { label: "북마크", href: "/bookmarks", icon: "🔖" },
  { label: "할일", href: "/todos", icon: "✅" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 left-0 w-56 h-[calc(100vh-3.5rem)] bg-[#1a1a2e] border-r border-white/10 p-4">
      <nav className="flex flex-col gap-1">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname.startsWith(menu.href)
                ? "bg-[#0f3460] text-white font-medium"
                : "text-white/60 hover:text-white hover:bg-white/5"
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
