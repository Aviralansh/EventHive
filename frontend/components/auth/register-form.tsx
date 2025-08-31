"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepIndicator } from "./step-indicator"
import { PasswordStrength } from "./password-strength"
import { RoleSelector } from "./role-selector"

export default function RegisterForm() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [role, setRole] = useState<"attendee" | "organizer" | undefined>()
  const [org, setOrg] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function next() {
    setError(null)
    if (step === 1) {
      if (!name || !email || !password || !accepted) {
        setError("Please complete all fields and accept the terms.")
        return
      }
      setStep(2)
    } else {
      submit()
    }
  }
  function back() {
    setStep((s) => Math.max(1, s - 1))
  }
  function submit() {
    setError(null)
    if (!role) {
      setError("Please choose a role to continue.")
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      window.location.href = "/profile"
    }, 900)
  }

  return (
    <div className="space-y-5">
      <StepIndicator step={step} />
      {step === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <PasswordStrength value={password} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            I agree to the Terms and Privacy Policy
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <RoleSelector value={role} onChange={setRole} />
          <div className="space-y-2">
            <Label htmlFor="org">Organization (optional)</Label>
            <Input id="org" placeholder="Your org or team" value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
        </div>
      )}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <div className="flex items-center justify-between">
        <Button variant="outline" type="button" onClick={back} disabled={step === 1 || submitting}>
          Back
        </Button>
        <Button className="bg-primary hover:bg-primary/90" type="button" onClick={next} disabled={submitting}>
          {step === 1 ? "Continue" : submitting ? "Creating…" : "Create account"}
        </Button>
      </div>
    </div>
  )
}
