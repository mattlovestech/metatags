import Image from "next/image"

interface IMessagePreviewProps {
  url: string
  title: string
  description: string
  image: string
}

export function IMessagePreview({ url, title, description, image }: IMessagePreviewProps) {
  return (
    <div className="bg-[#f1f1f1] p-4 rounded-lg max-w-sm font-sans">
          <div className="mt-2 text-center">
        <p className="text-[10px] text-gray-500">Today 10:30 AM</p>
      </div>
      <div className="flex flex-col items-end">
        <div className="bg-[#34C759] text-white p-2 rounded-t-2xl rounded-l-2xl max-w-[70%] mb-2">
          <p className="text-sm">Check out this link!</p>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-md max-w-[70%] mb-1">
          <div className="relative w-full h-32">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-[#0A84FF] text-sm truncate">{title}</h3>
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{description}</p>
            <p className="text-gray-400 text-[10px] mt-1 truncate">{url}</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mr-1">Delivered</p>
      </div>

    </div>
  )
}

