"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Megaphone, Ticket } from "lucide-react"

export type Role = "attendee" | "organizer"

export function RoleSelector({
  value,
  onChange,
}: {
  value: Role | null
  onChange: (v: Role) => void
}) {
  const base =
    "cursor-pointer rounded-lg border transition-all hover:shadow-sm aria-selected:ring-2 aria-selected:ring-offset-2 aria-selected:ring-primary"
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card
        role="radio"
        aria-selected={value === "attendee"}
        tabIndex={0}
        onClick={() => onChange("attendee")}
        className={cn(base, value === "attendee" ? "border-primary" : "")}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <Ticket className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Attendee</p>
            <p className="text-xs text-slate-600">Discover and book events</p>
          </div>
        </CardContent>
      </Card>
      <Card
        role="radio"
        aria-selected={value === "organizer"}
        tabIndex={0}
        onClick={() => onChange("organizer")}
        className={cn(base, value === "organizer" ? "border-primary" : "")}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <Megaphone className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Organizer</p>
            <p className="text-xs text-slate-600">Create and manage events</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
