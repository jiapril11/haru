import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SAMPLE_TODOS, SAMPLE_BOOKMARKS } from "./data";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const demoUserId = process.env.DEMO_USER_ID;

  if (!supabaseUrl || !serviceRoleKey || !demoUserId) {
    return NextResponse.json(
      { error: "Server configuration missing" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  await supabase.from("todos").delete().eq("user_id", demoUserId);
  await supabase.from("bookmarks").delete().eq("user_id", demoUserId);

  const { error: insertTodosError } = await supabase.from("todos").insert(
    SAMPLE_TODOS.map((todo) => ({ ...todo, user_id: demoUserId })),
  );
  if (insertTodosError) {
    return NextResponse.json({ error: "Failed to insert todos" }, { status: 500 });
  }

  const { error: insertBookmarksError } = await supabase.from("bookmarks").insert(
    SAMPLE_BOOKMARKS.map((bookmark) => ({ ...bookmark, user_id: demoUserId })),
  );
  if (insertBookmarksError) {
    return NextResponse.json({ error: "Failed to insert bookmarks" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
