import { NextRequest, NextResponse } from "next/server";
import type { Article } from "@/lib/mock-data";

// Map WordPress category IDs to our categories
// You may need to adjust these IDs based on your WordPress site's actual category IDs
const CATEGORY_MAP: Record<number, Article["category"]> = {
  // These are example mappings - adjust based on your actual WordPress category IDs
  // You can find your category IDs at: https://cryptonewsorg.com/wp-json/wp/v2/categories
  1: "Markets",
  2: "DeFi",
  3: "Layer2",
  4: "AI",
  5: "Regulation",
  6: "Infrastructure",
};

// Sentiment keywords for basic inference
const BULLISH_KEYWORDS = [
  "surge",
  "soar",
  "bull",
  "gain",
  "rise",
  "pump",
  "rally",
  "breakout",
  "explosive",
  "outperform",
];
const BEARISH_KEYWORDS = [
  "crash",
  "plunge",
  "bear",
  "decline",
  "fall",
  "dump",
  "selloff",
  "collapse",
  "bearish",
  "underperform",
];

function inferSentiment(text: string): Article["sentiment"] {
  const lowerText = text.toLowerCase();
  const bullishCount = BULLISH_KEYWORDS.filter(k => lowerText.includes(k)).length;
  const bearishCount = BEARISH_KEYWORDS.filter(k => lowerText.includes(k)).length;

  if (bullishCount > bearishCount) return "bullish";
  if (bearishCount > bullishCount) return "bearish";
  return "neutral";
}

function getCategoryFromPostCategories(categories: number[]): Article["category"] {
  // Try to find a mapped category
  for (const catId of categories) {
    if (CATEGORY_MAP[catId]) {
      return CATEGORY_MAP[catId];
    }
  }
  // Default category
  return "Markets";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function transformWordPressArticle(post: any): Article {
  const title = stripHtml(post.title.rendered);
  const summary = stripHtml(post.excerpt.rendered);
  const category = getCategoryFromPostCategories(post.categories || []);
  const sentiment = inferSentiment(title + " " + summary);

  return {
    id: `wp-${post.id}`,
    title,
    source: "cryptonewsorg.com",
    category,
    summary,
    content: stripHtml(post.content.rendered),
    timestamp: post.date,
    readTime: Math.ceil(stripHtml(post.content.rendered).split(/\s+/).length / 200), // ~200 words per minute
    tags: post.tags || [],
    trending: post._links?.replies?.[0]?.count > 5 || false, // Simple heuristic
    sentiment,
    url: post.link,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Call WordPress REST API
    const wpUrl = new URL("https://cryptonewsorg.com/wp-json/wp/v2/posts");
    wpUrl.searchParams.set("search", query);
    wpUrl.searchParams.set("per_page", "20");
    wpUrl.searchParams.set("_embed", "1"); // Include embedded content like categories/tags

    const response = await fetch(wpUrl.toString(), {
      headers: {
        "User-Agent": "Tech-News-Studio/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();

    // Transform WordPress posts to our Article format
    const articles: Article[] = posts.map(transformWordPressArticle);

    return NextResponse.json({ results: articles });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search articles", results: [] },
      { status: 500 }
    );
  }
}
