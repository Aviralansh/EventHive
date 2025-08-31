import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BrandLogo } from "@/components/brand/logo"

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-8 px-4 text-center">
      <BrandLogo />
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold text-balance">
          Plan, discover, and enjoy events with <span className="text-accent">EventHive</span>
        </h1>
        <p className="text-muted-foreground">
          A modern interface to explore concerts, conferences, and community meetups.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button className="bg-primary hover:bg-primary/90">Sign in</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Create account</Button>
        </Link>
      </div>
    </main>
  )
}
