"use client";

import { createClient } from "@/lib/supabase/server";
import BookmarkCard from "@/components/bookmark/BookmarkCard";
import TagFilter from "@/components/bookmark/TagFilter";
import Link from "next/link";
import { Suspense, useState } from "react";
import SearchBar from "@/components/bookmark/SearchBar";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function BookmarksPage() {
  const { data: bookmarks, isLoading } = useBookmarks();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = bookmarks?.filter((b) => {
    const matchTag = activeTag ? b.tags.includes(activeTag) : true;
    const keyword = q.toLowerCase();
    const matchQ = q
      ? b.title?.toLowerCase().includes(keyword) ||
        b.url.toLowerCase().includes(keyword) ||
        b.description?.toLowerCase().includes(keyword) ||
        b.tags.some((t) => t.toLowerCase().includes(keyword))
      : true;
    return matchTag && matchQ;
  });

  // 전체 태그 목록 수집 (중복 제거)
  const allTags = [...new Set(bookmarks?.flatMap((b) => b.tags) ?? [])];

  return (
    <div>
      {/* 헤더 */}
      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          북마크
          {activeTag && (
            <span className="ml-2 text-sm font-normal text-white/40">
              #{activeTag}
            </span>
          )}
        </h1>
        <Link
          href="/bookmarks/new"
          className="rounded-lg bg-[#e94560] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c73652]"
        >
          + 추가
        </Link>
      </div>

      {/* 검색 */}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="제목, URL, 태그 검색..."
        className="mb-4 w-full rounded-lg border border-white/10 bg-[#16213e] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
      />

      {/* 태그 필터 */}
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs transition-colors ${
                activeTag === tag
                  ? "bg-[#e94560] text-white"
                  : "border border-white/10 bg-[#16213e] text-white/50 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 로딩 */}
      {isLoading && (
        <div className="flex justify-center py-24">
          <p className="text-sm text-white/30">불러오는 중...</p>
        </div>
      )}

      {/* 목록 */}
      {!isLoading && (!filtered || filtered.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 text-4xl">🔖</p>
          <p className="text-sm text-white/40">
            {q || activeTag
              ? "검색 결과가 없어요."
              : "아직 저장된 북마크가 없어요."}
          </p>
          {!q && !activeTag && (
            <Link
              href="/bookmarks/new"
              className="mt-4 text-sm text-[#e94560] hover:underline"
            >
              첫 번째 북마크 추가하기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
