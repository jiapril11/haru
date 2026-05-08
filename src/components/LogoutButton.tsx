"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    queryClient.clear();
    window.location.href = "/auth/login";
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
