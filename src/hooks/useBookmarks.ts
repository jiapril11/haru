import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchBookmarks(): Promise<Bookmark[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });
}
