"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Gnb() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#16213e] px-4">
      <span className="text-lg font-bold tracking-tight text-white">
        Haru<span className="text-[#e94560]">.</span>
      </span>
      <button
        onClick={handleLogout}
        className="text-sm text-white/40 transition-colors hover:text-white"
      >
        로그아웃
      </button>
    </header>
  );
}
