"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

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
          Haru<span className="text-[#e94560]">.</span>
        </h1>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          북마크와 투두를 한 곳에서
        </p>
      </div>

      {/* card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="mb-6 flex rounded-lg bg-[var(--bg)] p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 cursor-pointer rounded-md py-2 text-sm transition-colors ${mode === "login" ? "bg-[var(--accent)] font-medium text-white" : "text-[var(--text-subtle)] hover:text-[var(--text)]"}`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setMode("signup");
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

          {error && <p className="text-xs text-[#e94560]">{error}</p>}
          {message && <p className="text-xs text-green-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="transition-color cursor-pointers mt-2 w-full cursor-pointer rounded-lg bg-[#e94560] py-2.5 text-sm font-medium text-white hover:bg-[#c73652] disabled:opacity-50"
          >
            {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
