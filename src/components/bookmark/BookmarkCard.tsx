"use client";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateBookmark } from "@/hooks/useBookmarks";

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const updateBookmark = useUpdateBookmark();

  const [isFavorite, setIsFavorite] = useState(bookmark.is_favorite);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(bookmark.title ?? "");
  const [editDescription, setEditDescription] = useState(bookmark.description ?? "");
  const [editTagsRaw, setEditTagsRaw] = useState(bookmark.tags.join(", "));

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

  function handleSave() {
    updateBookmark.mutate(
      {
        id: bookmark.id,
        title: editTitle.trim() || null,
        description: editDescription.trim() || null,
        tags: editTagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleCancel() {
    setEditTitle(bookmark.title ?? "");
    setEditDescription(bookmark.description ?? "");
    setEditTagsRaw(bookmark.tags.join(", "));
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex flex-col rounded-xl border border-[var(--accent)] bg-[var(--surface)] p-4">
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            placeholder="제목"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel()}
            className="w-full rounded-lg bg-[var(--surface2)] px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <textarea
            placeholder="설명"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg bg-[var(--surface2)] px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <input
            placeholder="태그 (쉼표로 구분)"
            value={editTagsRaw}
            onChange={(e) => setEditTagsRaw(e.target.value)}
            className="w-full rounded-lg bg-[var(--surface2)] px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="cursor-pointer text-xs text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={updateBookmark.isPending}
              className="cursor-pointer text-xs text-[var(--accent)] hover:opacity-80 disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--border)]">
      <div className="mb-3 flex items-center gap-2">
        {bookmark.favicon_url ? (
          <img
            src={bookmark.favicon_url}
            alt=""
            className="h-4 w-4 rounded-sm"
          />
        ) : (
          <div className="h-4 w-4 rounded-sm bg-[var(--border)]" />
        )}
        <span className="flex-1 truncate text-xs text-[var(--text-subtle)]">
          {new URL(bookmark.url).hostname}
        </span>
        <button
          onClick={handleFavorite}
          className={`cursor-pointer text-sm transition-colors ${
            isFavorite
              ? "text-yellow-400"
              : "text-[var(--text-faint)] hover:text-yellow-400"
          }`}
        >
          ★
        </button>
      </div>

      <h3 className="mb-1 line-clamp-2 text-sm leading-relaxed font-medium text-[var(--text)]">
        {bookmark.title ?? bookmark.url}
      </h3>

      {bookmark.description && (
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--text-subtle)]">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-xs text-[var(--accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-3 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#e94560]"
        >
          열기 →
        </a>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-[12px]! text-[var(--text-faint)] transition-colors hover:text-[var(--text)]"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer text-[12px]! text-[var(--text-faint)] transition-colors hover:text-[#e94560]"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
