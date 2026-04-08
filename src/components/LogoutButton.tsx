"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
    >
      로그아웃
    </button>
  );
}
