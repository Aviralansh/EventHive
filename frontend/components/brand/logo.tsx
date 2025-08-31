"use client"

import Link from "next/link"

export function BrandLogo({
  withWord = true,
  className = "",
}: {
  withWord?: boolean
  className?: string
}) {
  return (
    <>
      {/* Fixed top-left logo */}
      <Link href="/" aria-label="EventHive Home" className="fixed top-1 left-0 -ml-1 sm:-ml-2 z-50 inline-flex">
        <img
          src="/images/eventhive-logo.png"
          alt="EventHive logo"
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
          loading="eager"
        />
        <span className="sr-only">EventHive</span>
      </Link>

      {/* In-flow wordmark (no image), slightly zoomed */}
      <Link href="/" aria-label="EventHive Home" className={`flex items-center gap-3 ${className}`}>
        {withWord && (
          <span className="font-semibold tracking-tight text-lg origin-left scale-110 sm:scale-125">
            <span className="text-primary">Event</span>
            <span className="text-accent">Hive</span>
          </span>
        )}
      </Link>
    </>
  )
}
