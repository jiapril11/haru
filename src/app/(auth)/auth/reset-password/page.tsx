"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getKoreanResetErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  // 비밀번호 재사용 제한
  if (
    normalized.includes("new password should be different from the old password") ||
    normalized.includes("same as the old")
  ) {
    return "새 비밀번호는 기존 비밀번호와 다르게 설정해주세요.";
  }

  // 비밀번호 정책
  if (
    normalized.includes("password should be at least") ||
    normalized.includes("weak password") ||
    normalized.includes("password is too weak")
  ) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }

  // 토큰/링크 문제
  if (
    (normalized.includes("invalid") && normalized.includes("token")) ||
    normalized.includes("expired") ||
    normalized.includes("jwt") ||
    normalized.includes("otp expired") ||
    normalized.includes("token has expired")
  ) {
    return "링크가 만료되었거나 유효하지 않습니다. 다시 요청해주세요.";
  }

  // 인증 세션 문제
  if (
    normalized.includes("auth session missing") ||
    normalized.includes("session not found") ||
    normalized.includes("invalid session")
  ) {
    return "인증 세션이 유효하지 않습니다. 비밀번호 재설정 링크를 다시 요청해주세요.";
  }

  // 요청 제한/일시적 장애
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  if (
    normalized.includes("network") ||
    normalized.includes("fetch") ||
    normalized.includes("timeout")
  ) {
    return "네트워크가 불안정합니다. 잠시 후 다시 시도해주세요.";
  }

  return "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

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
      setError(getKoreanResetErrorMessage(error.message));
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
