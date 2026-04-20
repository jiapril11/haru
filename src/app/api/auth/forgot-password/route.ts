import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const { email, redirectTo } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // admin API로 이메일 존재 여부 확인
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }

  const exists = data.users.some((u) => u.email === email);
  if (!exists) {
    return NextResponse.json({ error: "해당 이메일로 가입된 계정이 없습니다." }, { status: 404 });
  }

  // 존재하면 재설정 메일 발송
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (resetError) {
    return NextResponse.json({ error: "이메일 전송에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
