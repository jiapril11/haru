import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  let body: { email?: unknown; redirectTo?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { email, redirectTo } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  // 기본적인 이메일 형식 검사
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "유효한 이메일을 입력해주세요." }, { status: 400 });
  }

  if (typeof redirectTo !== "string" || !redirectTo.startsWith("/")) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // admin API로 이메일 존재 여부 확인
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("[forgot-password] listUsers error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }

  const exists = data.users.some((u) => u.email === email);
  if (!exists) {
    return NextResponse.json({ error: "해당 이메일로 가입된 계정이 없습니다." }, { status: 404 });
  }

  // 존재하면 재설정 메일 발송
  const origin = request.nextUrl.origin;
  const safeRedirectTo = `${origin}${redirectTo}`;
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: safeRedirectTo,
  });
  if (resetError) {
    console.error("[forgot-password] resetPasswordForEmail error:", resetError);
    const isRateLimit = resetError.message.toLowerCase().includes("rate limit");
    return NextResponse.json(
      { error: isRateLimit ? "rate limit exceeded" : "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
