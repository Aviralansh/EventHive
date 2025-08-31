"use client"
import { cn } from "@/lib/utils"

export function AlertBanner({
  type = "error",
  message,
  className,
}: {
  type?: "error" | "success" | "info"
  message: string
  className?: string
}) {
  const styles =
    type === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : type === "info"
        ? "bg-slate-50 text-slate-700 border-slate-200"
        : "bg-rose-50 text-rose-700 border-rose-200"
  return (
    <div role="alert" className={cn("border rounded-md px-3 py-2 text-sm", styles, className)}>
      {message}
    </div>
  )
}
