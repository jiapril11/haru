import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SAMPLE_TODOS, SAMPLE_BOOKMARKS } from "@/app/api/demo/reset/data";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const demoUserId = process.env.DEMO_USER_ID;
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

  if (!supabaseUrl || !serviceRoleKey || !demoUserId || !demoPassword) {
    return NextResponse.json({ error: "env missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error: authError } = await supabase.auth.admin.updateUserById(demoUserId, {
    password: demoPassword,
    email_confirm: true,
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  await supabase.from("todos").delete().eq("user_id", demoUserId);
  await supabase.from("bookmarks").delete().eq("user_id", demoUserId);

  await supabase.from("todos").insert(
    SAMPLE_TODOS.map((todo) => ({ ...todo, user_id: demoUserId })),
  );
  await supabase.from("bookmarks").insert(
    SAMPLE_BOOKMARKS.map((bookmark) => ({ ...bookmark, user_id: demoUserId })),
  );

  return NextResponse.json({ ok: true });
}
