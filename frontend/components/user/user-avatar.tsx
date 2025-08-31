"use client"
import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function UserAvatar({
  name,
  src,
  onChange,
}: {
  name: string
  src?: string | null
  onChange?: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(src || null)

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={preview || undefined} alt={name} />
        <AvatarFallback>{name?.slice(0, 2)?.toUpperCase() || "EH"}</AvatarFallback>
      </Avatar>
      <div className="grid gap-2">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Change avatar
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const url = URL.createObjectURL(file)
            setPreview(url)
            onChange?.(file)
          }}
        />
        <p className="text-xs text-slate-600">PNG/JPG up to 2MB</p>
      </div>
    </div>
  )
}
