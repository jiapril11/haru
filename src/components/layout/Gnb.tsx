"use client";

import ThemeToggle from "../ThemeToggle";
import LogoutButton from "@/components/LogoutButton";

export default function Gnb() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4">
      <span className="text-lg font-bold tracking-tight text-[var(--text)]">
        Haru<span className="text-[var(--primary)]">.</span>
      </span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
