"use client"
export function StepIndicator({ current, total = 2 }: { current: number; total?: number }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label="Progress">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1
        const active = step <= current
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`h-2 w-10 rounded-full ${active ? "bg-primary" : "bg-slate-200"}`}
              aria-current={active ? "step" : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
