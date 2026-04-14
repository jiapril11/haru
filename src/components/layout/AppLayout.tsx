"use client";

import { useState } from "react";
import Gnb from "./Gnb";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Gnb />
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((v) => !v)} />
      <main
        className={`h-dvh overflow-y-auto px-4 pt-14 pb-20 text-[var(--text)] md:px-6 md:pb-6 transition-[margin] duration-300 ${
          isCollapsed ? "md:ml-14" : "md:ml-56"
        }`}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
