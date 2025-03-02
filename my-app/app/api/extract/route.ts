import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract metadata
    const metadata = {
      title: $("title").text() || $('meta[property="og:title"]').attr("content") || "",
      description:
        $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "",
      image:
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        $('meta[name="twitter:image:src"]').attr("content") ||
        $('link[rel="image_src"]').attr("href") ||
        $('link[rel="apple-touch-icon"]').attr("href") ||
        $('link[rel="icon"]').attr("href") ||
        "",
      url: url,
      type: $('meta[property="og:type"]').attr("content") || "website",
      twitterCard: $('meta[name="twitter:card"]').attr("content") || "summary_large_image",
    }

    // If the image URL is relative, convert it to absolute
    if (metadata.image && !metadata.image.startsWith("http")) {
      const urlObj = new URL(url)
      metadata.image = `${urlObj.protocol}//${urlObj.host}${metadata.image.startsWith("/") ? "" : "/"}${metadata.image}`
    }

    console.log("Extracted metadata:", metadata)
    return NextResponse.json(metadata)
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
  }
}

