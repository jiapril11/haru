import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useUpdateBookmark() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: Pick<Bookmark, "id"> & Partial<Pick<Bookmark, "title" | "description" | "tags">>) => {
      const { error } = await supabase.from("bookmarks").update(fields).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}
