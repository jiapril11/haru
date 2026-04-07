"use client";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(bookmark.is_favorite);

  async function handleFavorite() {
    setIsFavorite((prev) => !prev);
    await supabase
      .from("bookmarks")
      .update({ is_favorite: !isFavorite })
      .eq("id", bookmark.id);
  }

  async function handleDelete() {
    if (!confirm("북마크를 삭제할까요?")) return;
    await supabase.from("bookmarks").delete().eq("id", bookmark.id);
    queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
  }
  return (
    <div className="group flex flex-col rounded-xl border border-white/10 bg-[#16213e] p-4 transition-colors hover:border-white/20">
      <div className="mb-3 flex items-center gap-2">
        {bookmark.favicon_url ? (
          <img
            src={bookmark.favicon_url}
            alt=""
            className="h-4 w-4 rounded-sm"
          />
        ) : (
          <div className="h-4 w-4 rounded-sm bg-white/10" />
        )}
        <span className="flex-1 truncate text-xs text-white/30">
          {new URL(bookmark.url).hostname}
        </span>
        <button
          onClick={handleFavorite}
          className={`cursor-pointer text-sm transition-colors ${
            isFavorite
              ? "text-yellow-400"
              : "text-white/20 hover:text-yellow-400"
          }`}
        >
          ★
        </button>
      </div>

      <h3 className="mb-1 line-clamp-2 text-sm leading-relaxed font-medium text-white">
        {bookmark.title ?? bookmark.url}
      </h3>

      {bookmark.description && (
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/40">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#0f3460] px-2 py-0.5 text-xs text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-3 opacity-0 transition-opacity group-hover:opacity-100">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#e94560]"
        >
          열기 →
        </a>
        <button
          onClick={handleDelete}
          className="cursor-pointer text-xs text-white/20 transition-colors hover:text-[#e94560]"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
