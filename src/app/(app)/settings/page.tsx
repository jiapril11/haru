"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "@/components/LogoutButton";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [deleteInput, setDeleteInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      if (data.user.email === process.env.NEXT_PUBLIC_DEMO_EMAIL) {
        router.replace("/todos");
        return;
      }
      if (data.user.email) setEmail(data.user.email);
    });
  }, [router]);

  async function handleDeleteAccount() {
    setDeleting(true);
    setError("");

    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setDeleting(false);
      return;
    }

    window.location.href = "/auth/login";
  }

  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="mb-8 text-xl font-bold text-[var(--text)]">설정</h1>

      {/* 계정 */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">계정</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-subtle)]">이메일</p>
            <p className="mt-0.5 text-sm text-[var(--text)]">{email || "—"}</p>
          </div>
          <LogoutButton />
        </div>
      </section>

      {/* 위험 구역 */}
      <section className="rounded-2xl border border-red-500/30 bg-[var(--surface)] p-6">
        <h2 className="mb-1 text-sm font-semibold text-red-500">위험 구역</h2>
        <p className="mb-4 text-xs text-[var(--text-subtle)]">
          탈퇴하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없어요.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="cursor-pointer rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
          >
            회원 탈퇴
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[var(--text-subtle)]">
              확인을 위해 아래에 <span className="font-semibold text-[var(--text)]">탈퇴</span>를 입력해주세요.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="탈퇴"
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-red-500 focus:outline-none"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput("");
                  setError("");
                }}
                className="cursor-pointer flex-1 rounded-lg border border-[var(--border)] py-2 text-sm text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "탈퇴" || deleting}
                className="flex-1 cursor-pointer rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? "처리 중..." : "탈퇴 확인"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
