export type Collection = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon_url: string | null;
  tags: string[];
  collection_id: string | null;
  is_favorite: boolean;
  created_at: string;
};

export type todo = {
  id: string;
  user_id: string;
  title: string;
  is_done: boolean;
  priority: "high" | "medium" | "low";
  due_date: string | null;
  sort_order: number;
  created_at: string;
};
