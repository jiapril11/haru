"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBookmarkPage() {
  const router = useRouter();
  const supabase = createClient();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [tags, setTags] = useState("");
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleUrlBlur() {
    if (!url) return;
    setFetching(true);
    try {
      const res = await fetch(
        `/api/bookmarks/meta?url=${encodeURIComponent(url)}`,
      );
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.favicon_url) setFaviconUrl(data.favicon_url);
    } catch (error) {}
    setFetching(false);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      url,
      title: title || null,
      description: description || null,
      favicon_url: faviconUrl || null,
      tags: tagList,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/bookmarks");
    }

    setSaving(false);
  }
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-white">북마크 추가</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* URL */}
        <div>
          <label className="mb-1.5 block text-xs text-white/60">URL *</label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              required
              placeholder="https://example.com"
              className="w-full rounded-lg border border-white/10 bg-[#16213e] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
            />
            {fetching && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-white/30">
                불러오는 중...
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/30">
            URL 입력 후 포커스를 벗어나면 자동으로 정보를 가져옵니다.
          </p>
        </div>

        {/* 제목 */}
        <div>
          <label className="mb-1.5 block text-xs text-white/60">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="자동으로 가져옵니다"
            className="w-full rounded-lg border border-white/10 bg-[#16213e] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="mb-1.5 block text-xs text-white/60">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="자동으로 가져옵니다"
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-[#16213e] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="mb-1.5 block text-xs text-white/60">태그</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, 디자인, 참고자료 (쉼표로 구분)"
            className="w-full rounded-lg border border-white/10 bg-[#16213e] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
          />
        </div>

        {error && <p className="text-xs text-[#e94560]">{error}</p>}

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg bg-white/5 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-[#e94560] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c73652] disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
