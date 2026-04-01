import { Bookmark } from "@/types";
import Image from "next/image";

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: Props) {
  return (
    <div className="group rounded-xl border border-white/10 bg-[#16213e] p-4 transition-colors hover:border-white/20">
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
        <span className="truncate text-xs text-white/30">
          {new URL(bookmark.url).hostname}
        </span>
        {bookmark.is_favorite && (
          <span className="ml-auto text-xs text-yellow-400">★</span>
        )}
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
        <div className="mt-3 flex flex-wrap gap-1">
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

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-xs text-[#e94560] opacity-0 transition-opacity group-hover:opacity-100"
      >
        열기 →
      </a>
    </div>
  );
}
