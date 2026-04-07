"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`/bookmarks?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="제목, URL, 태그 검색"
      className="mb-4 w-full rounded-lg border border-white/10 bg-[#16213e] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#0f3460] focus:outline-none"
    />
  );
}
