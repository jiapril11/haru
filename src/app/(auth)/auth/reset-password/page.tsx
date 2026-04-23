"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const hasHashError = hash.includes("error=");

  const [initError, setInitError] = useState(hasHashError ? "링크가 만료되었거나 유효하지 않습니다. 다시 요청해주세요." : "");
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasHashError) return;

    async function init() {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (accessToken && refreshToken && type === "recovery") {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error) {
          setReady(true);
          return;
        }
      }

      // 이미 세션이 있는 경우
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        setInitError("링크가 만료되었거나 유효하지 않습니다. 다시 요청해주세요.");
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHashError]);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      await supabase.auth.signOut();
      router.push("/auth/login");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text)]">
          <Link href={"/"}>
            Haru<span className="text-[#e94560]">.</span>
          </Link>
        </h1>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          새 비밀번호를 설정해주세요
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        {initError ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm text-[#e94560]">{initError}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="cursor-pointer text-xs text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        ) : !ready ? (
          <p className="text-center text-sm text-[var(--text-subtle)]">
            링크를 확인하는 중...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs text-[var(--text-muted)]">
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="6자 이상"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-[var(--text-muted)]">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="비밀번호 재입력"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-[#e94560]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer rounded-lg bg-[#e94560] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c73652] disabled:opacity-50"
            >
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
