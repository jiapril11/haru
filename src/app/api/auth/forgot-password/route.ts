import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

function isPrivateIpHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("10.") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("172.")
  );
}

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

  // 이메일 존재 여부를 먼저 조회하는 방식은 느리고(전체 유저 조회),
  // 사용자 열거(user enumeration) 문제도 생길 수 있어 여기서는
  // 재설정 메일 발송만 수행합니다.
  // Supabase Auth의 redirect allowlist에 맞추기 위해,
  // 개발환경에서 사설 IP로 접속한 경우 localhost로 강제합니다.
  const reqOrigin = request.nextUrl.origin;
  const reqHostname = request.nextUrl.hostname;
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (isPrivateIpHost(reqHostname) ? "http://localhost:3000" : reqOrigin);

  const safeRedirectTo = `${origin}${redirectTo}`;
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: safeRedirectTo,
  });
  if (resetError) {
    console.error("[forgot-password] resetPasswordForEmail error:", resetError);
    const isRateLimit = resetError.message.toLowerCase().includes("rate limit");
    return NextResponse.json(
      {
        error: isRateLimit
          ? "rate limit exceeded"
          : process.env.NODE_ENV === "production"
            ? "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요."
            : resetError.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
