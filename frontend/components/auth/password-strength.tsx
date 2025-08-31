"use client"

function scorePassword(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (pw.length >= 12) score++
  return Math.min(score, 5)
}

export function PasswordStrength({ value }: { value: string }) {
  const s = scorePassword(value)
  const pct = (s / 5) * 100
  const label = ["Very weak", "Weak", "Okay", "Good", "Strong"][Math.max(s - 1, 0)]
  const color = s <= 2 ? "bg-rose-500" : s === 3 ? "bg-yellow-500" : s === 4 ? "bg-emerald-500" : "bg-emerald-600"

  return (
    <div aria-live="polite" className="space-y-1">
      <div className="h-2 w-full rounded bg-muted">
        <div className={`h-2 rounded ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
