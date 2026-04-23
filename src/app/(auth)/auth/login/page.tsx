"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const RESET_LIMIT = 3;
  const RESET_WINDOW = 60 * 60 * 1000; // 1시간

  function getResetCount() {
    const raw = localStorage.getItem("reset_attempts");
    if (!raw) return { count: 0, firstAt: null };
    return JSON.parse(raw) as { count: number; firstAt: number };
  }

  function incrementResetCount() {
    const { count, firstAt } = getResetCount();
    const now = Date.now();
    if (!firstAt || now - firstAt > RESET_WINDOW) {
      localStorage.setItem(
        "reset_attempts",
        JSON.stringify({ count: 1, firstAt: now }),
      );
    } else {
      localStorage.setItem(
        "reset_attempts",
        JSON.stringify({ count: count + 1, firstAt }),
      );
    }
  }

  function getRemainingTime(firstAt: number) {
    const remaining = RESET_WINDOW - (Date.now() - firstAt);
    const minutes = Math.ceil(remaining / 60000);
    return `${minutes}분`;
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "forgot") {
      const { count, firstAt } = getResetCount();
      const now = Date.now();
      const isWithinWindow = firstAt && now - firstAt <= RESET_WINDOW;

      if (isWithinWindow && count >= RESET_LIMIT) {
        setError(
          `재설정 요청은 1시간에 ${RESET_LIMIT}번까지만 가능합니다. ${getRemainingTime(firstAt)} 후에 다시 시도해주세요.`,
        );
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirectTo: "/auth/callback?next=/auth/reset-password",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          typeof data.error === "string" &&
          data.error.toLowerCase().includes("rate limit")
            ? "이메일 전송 한도를 초과했습니다. 1시간 후에 다시 시도해주세요."
            : data.error;
        setError(msg);
      } else {
        incrementResetCount();
        const { count: newCount } = getResetCount();
        const remaining = RESET_LIMIT - newCount;
        setMessage(
          remaining > 0
            ? `비밀번호 재설정 링크를 이메일로 보냈습니다. (남은 횟수: ${remaining}회)`
            : "비밀번호 재설정 링크를 이메일로 보냈습니다. 1시간 후 다시 요청할 수 있습니다.",
        );
      }
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/todos");
        router.refresh();
      }
    } else {
      if (password.length < 6) {
        setError("비밀번호는 6자 이상이어야 합니다.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      } else {
        setMessage("가입 확인 이메일을 보냈습니다. 이메일을 확인해주세요");
      }
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text)]">
          <Link href="/">
            Haru<span className="text-[#e94560]">.</span>
          </Link>
        </h1>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          북마크와 투두를 한 곳에서
        </p>
      </div>

      {/* card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        {mode !== "forgot" && (
          <div className="mb-6 flex rounded-lg bg-[var(--bg)] p-1">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className={`flex-1 cursor-pointer rounded-md py-2 text-sm transition-colors ${mode === "login" ? "bg-[var(--accent)] font-medium text-white" : "text-[var(--text-subtle)] hover:text-[var(--text)]"}`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`flex-1 cursor-pointer rounded-md py-2 text-sm transition-colors ${
                mode === "signup"
                  ? "bg-[var(--accent)] font-medium text-white"
                  : "text-[var(--text-subtle)] hover:text-[var(--text)]"
              }`}
            >
              회원가입
            </button>
          </div>
        )}

        {mode === "forgot" && (
          <div className="mb-6">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className="cursor-pointer text-xs text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              ← 로그인으로 돌아가기
            </button>
            <p className="mt-3 text-sm font-medium text-[var(--text)]">
              비밀번호 찾기
            </p>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              가입한 이메일로 재설정 링크를 보내드려요.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-[var(--text-muted)]">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="hello@example.com"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <label className="mb-1.5 block text-xs text-[var(--text-muted)]">
                비밀번호
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
          )}

          {error && <p className="text-xs text-[#e94560]">{error}</p>}
          {message && <p className="text-xs text-green-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="transition-color cursor-pointers mt-2 w-full cursor-pointer rounded-lg bg-[#e94560] py-2.5 text-sm font-medium text-white hover:bg-[#c73652] disabled:opacity-50"
          >
            {loading
              ? "처리 중..."
              : mode === "login"
                ? "로그인"
                : mode === "signup"
                  ? "회원가입"
                  : "재설정 링크 보내기"}
          </button>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
                setMessage("");
              }}
              className="cursor-pointer text-center text-xs text-[var(--text-faint)] hover:text-[var(--text-subtle)]"
            >
              비밀번호를 잊으셨나요?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
