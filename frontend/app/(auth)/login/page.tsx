"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/components/auth/auth-input"
import { PasswordInput } from "@/components/auth/password-input"
import { AlertBanner } from "@/components/common/alert-banner"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { loginReq, setToken } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const emailError = email && !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : undefined
  const pwdError = password && password.length < 6 ? "Min 6 characters" : undefined
  const disabled = !email || !password || !!emailError || !!pwdError

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (disabled) return
    setLoading(true)
    setError(null)
    try {
      const res = await loginReq({ email, password })
      setToken(res.access_token, res.user, remember ? "local" : "session")
      setSuccess(true)
      setTimeout(() => router.push("/profile"), 900)
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100dvh-0px)] grid place-items-center bg-white">
      <Card className="w-full max-w-md border-slate-200">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center">
            {/* Use provided Source URL directly */}
            <img src="/images/eventhive-logo.png" alt="EventHive logo" width={160} height={40} />
          </div>
          <CardTitle className="text-center text-pretty">Welcome back</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error ? <AlertBanner type="error" message={error} /> : null}

          <form onSubmit={onSubmit} className="grid gap-4">
            <AuthInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              error={emailError}
              autoComplete="email"
              required
            />
            <PasswordInput value={password} onChange={setPassword} error={pwdError} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
              <a className="text-sm text-primary hover:underline" href="#">
                Forgot password
              </a>
            </div>
            <Button
              type="submit"
              disabled={loading || disabled}
              className="w-full bg-primary hover:bg-primary/90 focus-visible:ring-primary"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner className="h-4 w-4" /> Logging in...
                </span>
              ) : success ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded-full bg-emerald-500 animate-ping" /> Redirecting...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
