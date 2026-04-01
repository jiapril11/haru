import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 });
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
