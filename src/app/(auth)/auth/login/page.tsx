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

  async function handleSubmit(e: React.SubmitEvent) {
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
        setError(error.message);
      } else {
        router.push("/bookmarks");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("가입 확인 이메일을 보냈습니다. 이메일을 확인해주세요");
      }
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">
          Haru<span className="text-[#e94560]">.</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">북마크와 투두를 한 곳에서</p>
      </div>

      {/* card */}
      <div className="rounded-2xl border border-white/10 bg-[#16213e] p-8">
        <div className="mb-6 flex rounded-lg bg-[#0d0d1a] p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 cursor-pointer rounded-md py-2 text-sm transition-colors ${mode === "login" ? "bg-[#0f3460] font-medium text-white" : "text-white/40 hover:text-white"}`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setMode("signup");
            }}
            className={`flex-1 cursor-pointer rounded-md py-2 text-sm transition-colors ${
              mode === "signup"
                ? "bg-[#0f3460] font-medium text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/60">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="hello@example.com"
              className="w-full rounded-lg border border-white/10 bg-[#0d0d1a] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/60">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="6자 이상"
              className="w-full rounded-lg border border-white/10 bg-[#0d0d1a] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
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
