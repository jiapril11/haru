import BookmarkCard from "@/components/bookmark/BookmarkCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">북마크</h1>
        <Link
          href="/bookmarks/new"
          className="rounded-lg bg-[#e94560] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c73652]"
        >
          + 추가
        </Link>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 text-4xl">🔖</p>
          <p className="text-sm text-white/40">아직 저장된 북마크가 없어요.</p>
          <Link
            href="/bookmarks/new"
            className="mt-4 text-sm text-[#e94560] hover:underline"
          >
            첫 번째 북마크 추가하기
          </Link>
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
