import Image from "next/image"

interface SlackPreviewProps {
  url: string
  title: string
  description: string
  image: string
}

export function SlackPreview({ url, title, description, image }: SlackPreviewProps) {
  return (
    <div className="bg-white p-4 rounded-lg max-w-sm border border-gray-200">
      <div className="flex">
        <div className="w-2 bg-blue-500 mr-2"></div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
          <div className="mt-2 flex items-center">
            <div className="relative w-12 h-12 mr-2">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded" />
            </div>
            <p className="text-gray-400 text-xs truncate">{url}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

