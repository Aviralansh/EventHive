"use client"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function scorePassword(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 5)
}

export function PasswordInput({
  id = "password",
  label = "Password",
  value,
  onChange,
  showStrength = false,
  error,
}: {
  id?: string
  label?: string
  value: string
  onChange: (v: string) => void
  showStrength?: boolean
  error?: string
}) {
  const [show, setShow] = useState(false)
  const s = useMemo(() => scorePassword(value), [value])
  const strengthText = ["Very weak", "Weak", "Fair", "Good", "Strong"][Math.max(0, s - 1)] || "Very weak"
  const strengthColor = s >= 5 ? "bg-emerald-500" : s >= 3 ? "bg-amber-500" : "bg-rose-500"

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-rose-500 focus-visible:ring-rose-500 pr-20" : "pr-20"}
          autoComplete="new-password"
          required
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShow((v) => !v)}
          className="absolute right-1 top-1 h-7 px-2 text-xs"
        >
          {show ? "Hide" : "Show"}
        </Button>
      </div>
      {showStrength ? (
        <div className="grid gap-1">
          <div className="h-1.5 w-full bg-slate-200 rounded">
            <div className={`h-1.5 rounded ${strengthColor}`} style={{ width: `${(s / 5) * 100}%` }} aria-hidden />
          </div>
          <span className="text-xs text-slate-600">{strengthText}</span>
        </div>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
