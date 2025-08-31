"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (!email || !password) {
        setError("Please fill in your email and password.")
        return
      }
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/profile"
      }, 900)
    }, 700)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <Link href="#" className="text-sm text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
      {success && (
        <div role="status" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-lg bg-white p-6 shadow-xl text-center space-y-2">
            <div className="mx-auto h-10 w-10 rounded-full bg-accent/20 grid place-items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-accent" aria-hidden="true">
                <path fill="currentColor" d="M7.5 13.5l-3-3 1.4-1.4L7.5 10.7l6.6-6.6L15.5 5z" />
              </svg>
            </div>
            <p className="font-medium">Welcome back!</p>
            <p className="text-sm text-muted-foreground">Redirecting to your profile…</p>
          </div>
        </div>
      )}
    </form>
  )
}
