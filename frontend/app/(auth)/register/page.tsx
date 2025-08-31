"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/components/auth/auth-input"
import { PasswordInput } from "@/components/auth/password-input"
import { RoleSelector, type Role } from "@/components/auth/role-selector"
import { StepIndicator } from "@/components/auth/step-indicator"
import { AlertBanner } from "@/components/common/alert-banner"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { registerReq } from "@/lib/api"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<Role | null>(null)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const emailError = email && !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : undefined
  const nameError = fullName.trim().length === 0 ? "Full name is required" : undefined
  const pwdError = password.length < 8 ? "Min 8 characters" : undefined

  const step1Valid = !nameError && !emailError && !pwdError

  function submit() {
    if (!role || !agree) return
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        await registerReq({
          email,
          full_name: fullName,
          password,
          phone: phone || undefined,
          role,
        })
        router.push("/login")
      } catch (err: any) {
        setError(err?.message || "Registration failed")
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <main className="min-h-[calc(100dvh-0px)] grid place-items-center bg-white">
      <Card className="w-full max-w-xl border-slate-200">
        <CardHeader className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            {/* Use provided Source URL directly */}
            <img src="/images/eventhive-logo.png" alt="EventHive logo" width={160} height={40} />
            <StepIndicator current={step} />
          </div>
          <CardTitle className="text-center">{step === 1 ? "Create your account" : "A few more details"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error ? <AlertBanner type="error" message={error} /> : null}

          {step === 1 ? (
            <div className="grid gap-4">
              <AuthInput
                id="full_name"
                label="Full name"
                value={fullName}
                onChange={setFullName}
                error={nameError}
                required
              />
              <AuthInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                error={emailError}
                required
              />
              <PasswordInput value={password} onChange={setPassword} showStrength error={pwdError} />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                  className="bg-primary hover:bg-primary/90 focus-visible:ring-primary"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <AuthInput id="phone" label="Phone (optional)" type="tel" value={phone} onChange={setPhone} />
              <div className="grid gap-2">
                <label className="text-sm font-medium">Your role</label>
                <RoleSelector value={role} onChange={setRole} />
                {!role ? <p className="text-xs text-rose-600">Please select a role</p> : null}
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                <label htmlFor="terms" className="text-sm">
                  I agree to the Terms and Conditions
                </label>
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={submit}
                  disabled={loading || !role || !agree}
                  className="bg-primary hover:bg-primary/90 focus-visible:ring-primary"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner className="h-4 w-4" /> Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
