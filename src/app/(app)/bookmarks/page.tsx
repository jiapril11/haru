import { createClient } from "@/lib/supabase/server";
import BookmarkCard from "@/components/bookmark/BookmarkCard";
import TagFilter from "@/components/bookmark/TagFilter";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BookmarksPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const supabase = await createClient();

  const query = supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });
  if (tag) query.contains("tags", [tag]);
  const { data: bookmarks } = await query;

  // 전체 태그 목록 수집 (중복 제거)
  const allTags = [...new Set(bookmarks?.flatMap((b) => b.tags) ?? [])];

  return (
    <div>
      {/* 헤더 */}
      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          북마크
          {tag && (
            <span className="ml-2 text-sm font-normal text-white/40">
              #{tag}
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

      {/* 태그 필터 */}
      <Suspense>
        <TagFilter tags={allTags} />
      </Suspense>

      {/* 목록 */}
      {!bookmarks || bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 text-4xl">🔖</p>
          <p className="text-sm text-white/40">
            {tag
              ? `#${tag} 태그의 북마크가 없어요.`
              : "아직 저장된 북마크가 없어요."}
          </p>
          {!tag && (
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
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
