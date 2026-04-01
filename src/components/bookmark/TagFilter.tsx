"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  tags: string[];
};

export default function TagFilter({ tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  function handleTag(tag: string) {
    console.log(tag);
    if (activeTag === tag) {
      router.push("/bookmarks"); // 같은 태그 누르면 해제
    } else {
      router.push(`/bookmarks?tag=${encodeURIComponent(tag)}`);
    }
  }

  if (tags.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTag(tag)}
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
  );
}
