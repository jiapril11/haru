import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 });
  }

  // SSRF 방지: HTTPS 강제 + 내부 IP 차단 (IPv4 / IPv6 / 클라우드 메타데이터)
  try {
    const { hostname, protocol } = new URL(url);

    if (protocol !== "https:") {
      return NextResponse.json({ error: "HTTPS URL만 허용됩니다." }, { status: 400 });
    }

    const ipv4Blocked =
      /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.)/.test(hostname);
    // IPv6 localhost 및 link-local
    const ipv6Blocked = /^(\[?(::1|::ffff:|fe80:))/i.test(hostname);

    if (ipv4Blocked || ipv6Blocked) {
      return NextResponse.json({ error: "허용되지 않는 URL입니다." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "유효하지 않은 URL입니다." }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const getTag = (property: string) => {
      const match =
        html.match(
          new RegExp(
            `<meta[^>]*property="${property}"[^>]*content="([^"]*)"`,
            "i",
          ),
        ) ||
        html.match(
          new RegExp(
            `meta[^>]*content="([^"]*)"[^>]*property="${property}"`,
            "i",
          ),
        );
      return match?.[1] ?? null;
    };

    const getNameTag = (name: string) => {
      const match =
        html.match(
          new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`, "i"),
        ) ||
        html.match(
          new RegExp(`<meta[^>]*content="([^"]*)"[^>]*name="${name}"`, "i"),
        );
      return match?.[1] ?? null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    const title = getTag("og:title") ?? titleMatch?.[1]?.trim() ?? null;
    const description =
      getTag("og:description") ?? getNameTag("description") ?? null;
    const { hostname } = new URL(url);
    const favicon_url = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

    return NextResponse.json({ title, description, favicon_url });
  } catch {
    return NextResponse.json(
      { error: "메타데이터를 가져올 수 없습니다." },
      { status: 500 },
    );
  }
}
