import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    console.log(`Fetching metadata for URL: ${url}`)
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    const metadata = {
      title: $("title").text() || $('meta[property="og:title"]').attr("content") || "",
      description:
        $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "",
      image: $('meta[property="og:image"]').attr("content") || "",
    }

    console.log("Extracted metadata:", metadata)
    return NextResponse.json(metadata)
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json({ error: "Failed to fetch metadata", details: error.message }, { status: 500 })
  }
}

