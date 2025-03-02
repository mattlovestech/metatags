"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Copy,
  Check,
  ArrowUp,
  Info,
  Globe,
  Twitter,
  MessageCircle,
  Command,
  ComputerIcon as Windows,
  Eye,
} from "lucide-react"
import { Linkedin, Slack } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import Footer from "@/components/footer"

export default function MetatagsAnalyzer() {
  const [inputUrl, setInputUrl] = useState("")
  const [metadata, setMetadata] = useState({
    url: "https://metatags.io/",
    title: "Meta Tags — Preview, Edit and Generate",
    description:
      "With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!",
    image: "https://metatags.io/images/meta-tags.png",
    error: null as string | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [osType, setOsType] = useState<"mac" | "windows" | "other">("other")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const detectOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      if (userAgent.includes("mac")) return "mac"
      if (userAgent.includes("win")) return "windows"
      return "other"
    }
    setOsType(detectOS())
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const previewSection = document.getElementById("preview-section")
        if (previewSection) previewSection.scrollIntoView({ behavior: "smooth" })
      } else if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const codeSection = document.getElementById("code-section")
        if (codeSection) codeSection.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const formatUrl = (url: string) => {
    if (!url) return url
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`
    }
    return url
  }

  const handleExtract = async () => {
    if (!inputUrl) return

    const formattedUrl = formatUrl(inputUrl)
    setIsLoading(true)
    setMetadata((prev) => ({ ...prev, error: null })) // Reset error state

    try {
      const response = await fetch(`/api/extract?url=${encodeURIComponent(formattedUrl)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setMetadata({
        url: data.url || formattedUrl,
        title: data.title || "",
        description: data.description || "",
        image: data.image || "https://placehold.co/1200x630/png?text=No+Image+Found",
        error: null,
      })
    } catch (error) {
      console.error("Error:", error)
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        if (error.message.includes("ENOTFOUND")) {
          errorMessage = "Invalid URL or the site doesn't exist"
        } else if (error.message.includes("ETIMEDOUT")) {
          errorMessage = "The request timed out. The site might be down or blocking our request"
        } else if (error.message.includes("403")) {
          errorMessage = "Access forbidden. The site may be blocking our request"
        } else {
          errorMessage = error.message
        }
      }
      setMetadata((prev) => ({
        ...prev,
        error: errorMessage,
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") {
          setMetadata((prev) => ({ ...prev, image: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const file = e.dataTransfer.files[0]
      if (file) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload],
  )

  const generateHtmlCode = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <meta name="title" content="${metadata.title}">
  <meta name="description" content="${metadata.description}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${metadata.url}">
  <meta property="og:title" content="${metadata.title}">
  <meta property="og:description" content="${metadata.description}">
  <meta property="og:image" content="${metadata.image}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${metadata.url}">
  <meta property="twitter:title" content="${metadata.title}">
  <meta property="twitter:description" content="${metadata.description}">
  <meta property="twitter:image" content="${metadata.image}">

  <!-- Additional Meta Tags -->
  <meta name="author" content="Your Name or Organization">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${metadata.url}">

  <!-- Apple Touch Icon (for iOS devices) -->
  <link rel="apple-touch-icon" sizes="180x180" href="/path-to-your-icon.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/path-to-your-favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/path-to-your-favicon-16x16.png">

  <!-- JSON-LD for structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${metadata.title}",
    "description": "${metadata.description}",
    "url": "${metadata.url}",
    "image": "${metadata.image}"
  }
  </script>
</head>
<body>
  <!-- Your page content here -->
</body>
</html>`

  const KeyboardButton = () => {
    switch (osType) {
      case "mac":
        return <Command className="w-4 h-4" />
      case "windows":
        return <Windows className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Metatags Analyzer</h1>
        <p className="text-xl text-gray-600 mb-6">Analyze and preview website metadata</p>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-grow">
              <Label htmlFor="inputUrl" className="sr-only">
                Enter URL
              </Label>
              <Input
                id="inputUrl"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleExtract()
                  }
                }}
                placeholder="Enter a URL to analyze (e.g., example.com)"
                className="w-full"
              />
            </div>
            <Button
              onClick={handleExtract}
              disabled={isLoading}
              className="bg-[#14171A] hover:bg-[#14171A]/90 flex items-center gap-2"
            >
              {isLoading ? (
                "Extracting..."
              ) : (
                <>
                  Extract
                  <span className="text-xs flex items-center gap-1">
                    <KeyboardButton />
                    <span>Enter</span>
                  </span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const codeSection = document.getElementById("code-section")
                if (codeSection) codeSection.scrollIntoView({ behavior: "smooth" })
              }}
              className="flex items-center gap-2"
            >
              Get Code
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="image">Image</Label>
              <span className="text-sm font-medium text-slate-600">Recommend 1200×628</span>
            </div>
            <div
              className="relative h-[270px] rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden"
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add("border-primary")
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove("border-primary")
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove("border-primary")
                handleDrop(e)
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${metadata.image})`,
                }}
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 ${metadata.image !== "https://metatags.io/images/meta-tags.png" ? "bg-white/20" : "bg-white/80"} backdrop-blur-sm transition-opacity duration-300`}
              />

              {/* Upload content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <ArrowUp className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-sm font-medium">DRAG & DROP OR CLICK</div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="title">Title</Label>
              <div className="text-muted-foreground hover:text-foreground cursor-help">
                <Info className="h-4 w-4" />
              </div>
            </div>
            <Input
              id="title"
              value={metadata.title}
              onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor="description">Description</Label>
              <div className="text-muted-foreground hover:text-foreground cursor-help">
                <Info className="h-4 w-4" />
              </div>
            </div>
            <Textarea
              id="description"
              value={metadata.description}
              onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-base font-medium text-slate-600 mb-2">HTML Code</h2>
            <div id="code-section" className="bg-[#0F1117] p-4 rounded-xl relative h-[600px]">
              <pre className="text-sm text-gray-300 overflow-auto h-full scrollbar-none">
                <code className="text-gray-200 whitespace-pre-wrap">{generateHtmlCode()}</code>
              </pre>
              <Button
                className="absolute top-3 right-3 bg-gray-800/50 hover:bg-gray-800/70"
                size="sm"
                onClick={() => copyToClipboard(generateHtmlCode())}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div id="preview-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-slate-600">Preview</h2>
              <div className="flex gap-2">
                {["Google", "Twitter", "iMessage", "Slack", "LinkedIn"].map((platform) => (
                  <Button
                    key={platform}
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    onClick={() =>
                      document
                        .getElementById(`${platform.toLowerCase()}-preview`)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Eye className="w-4 h-4" />
                    <span>{platform}</span>
                  </Button>
                ))}
              </div>
            </div>
            {metadata.error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{metadata.error}</span>
              </div>
            )}
            <div className="space-y-6">
              <section id="google-preview" className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-base font-medium text-slate-600 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-600" />
                  Google
                </h3>
                {metadata.error ? (
                  <div className="text-red-500">Unable to generate preview due to an error.</div>
                ) : (
                  <div className="max-w-full">
                    <div className="text-[#1a0dab] text-xl hover:underline cursor-pointer">{metadata.title}</div>
                    <div className="text-[#006621] text-sm my-1">{metadata.url}</div>
                    <div className="text-[#545454] text-sm">{metadata.description}</div>
                  </div>
                )}
              </section>

              <div id="twitter-preview">
                <h3 className="text-base font-medium text-slate-600 mb-4 flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-slate-600" />
                  Twitter
                </h3>
                {metadata.error ? (
                  <div className="text-red-500">Unable to generate preview due to an error.</div>
                ) : (
                  <div className="max-w-full rounded-lg overflow-hidden border border-gray-300">
                    <div className="relative w-full h-[200px]">
                      <Image
                        src={metadata.image || "/placeholder.svg"}
                        alt={metadata.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-[#0f1419] text-base">{metadata.title}</h3>
                      <p className="text-[#536471] text-sm mt-1">{metadata.description}</p>
                      <p className="text-[#536471] text-sm mt-2 flex items-center">
                        <Image src="/link-icon.png" alt="Link" width={16} height={16} className="mr-1" />
                        {metadata.url}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div id="imessage-preview">
                <h3 className="text-base font-medium text-slate-600 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-slate-600" />
                  iMessage
                </h3>
                {metadata.error ? (
                  <div className="text-red-500">Unable to generate preview due to an error.</div>
                ) : (
                  <div className="bg-[#f1f1f1] p-4 rounded-lg max-w-sm font-sans">
                    <div className="mt-2 text-center">
                      <p className="text-[10px] text-gray-500">Today {format(new Date(), "h:mm a")}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-[#34C759] text-white p-2 rounded-t-2xl rounded-l-2xl max-w-[70%] mb-2">
                        <p className="text-sm">Check out this link!</p>
                      </div>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-md max-w-[70%] mb-1">
                        <div className="relative w-full h-32">
                          <Image
                            src={metadata.image || "/placeholder.svg"}
                            alt={metadata.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-[#0A84FF] text-sm truncate">{metadata.title}</h3>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">{metadata.description}</p>
                          <p className="text-gray-400 text-[10px] mt-1 truncate">{metadata.url}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mr-1">Delivered</p>
                    </div>
                  </div>
                )}
              </div>

              <section id="slack-preview" className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-base font-medium text-slate-600 mb-4 flex items-center gap-2">
                  <Slack className="w-4 h-4 text-slate-600" />
                  Slack
                </h3>
                {metadata.error ? (
                  <div className="text-red-500">Unable to generate preview due to an error.</div>
                ) : (
                  <div className="max-w-full rounded-lg overflow-hidden border border-gray-300 font-sans">
                    <div className="flex items-start p-4 bg-white">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-sm flex items-center justify-center text-white font-bold">
                          JD
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-baseline">
                          <span className="font-bold text-gray-900 mr-2">John Doe</span>
                          <span className="text-xs text-gray-500">11:30 AM</span>
                        </div>
                        <p className="text-gray-700 mb-2">Check out this link:</p>
                        <div className="border border-gray-300 rounded overflow-hidden">
                          <div className="relative w-full h-[150px]">
                            <Image
                              src={metadata.image || "/placeholder.svg"}
                              alt={metadata.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="p-3 bg-white">
                            <h4 className="font-bold text-blue-600 hover:underline">{metadata.title}</h4>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{metadata.description}</p>
                            <p className="text-gray-400 text-xs mt-1 truncate">{metadata.url}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section id="linkedin-preview" className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-base font-medium text-slate-600 mb-4 flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-slate-600" />
                  LinkedIn
                </h3>
                {metadata.error ? (
                  <div className="text-red-500">Unable to generate preview due to an error.</div>
                ) : (
                  <div className="max-w-full rounded-lg overflow-hidden border border-gray-300 font-sans">
                    <div className="p-4 bg-white">
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                          <p className="font-semibold text-[#000000]">John Doe</p>
                          <p className="text-gray-500 text-sm">500+ connections</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Check out this interesting link I found!</p>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="relative w-full h-[200px]">
                          <Image
                            src={metadata.image || "/placeholder.svg"}
                            alt={metadata.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="p-3 bg-gray-50">
                          <h4 className="font-semibold text-[#000000] text-base mb-1">{metadata.title}</h4>
                          <p className="text-[#000000] text-sm mb-2 line-clamp-2">{metadata.description}</p>
                          <p className="text-gray-500 text-xs">{metadata.url}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <span className="text-blue-600">Like</span>
                          <span className="text-blue-600">Comment</span>
                        </div>
                        <span className="text-blue-600">Share</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

    </div>
  )
}

