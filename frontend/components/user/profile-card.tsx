"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfileCard() {
  const [name, setName] = useState("Alex Johnson")
  const [email] = useState("alex@example.com")
  const [role] = useState<"attendee" | "organizer">("attendee")
  const [avatar, setAvatar] = useState<string | null>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(f)
  }

  return (
    <Card className="w-full max-w-3xl border-border">
      <CardHeader>
        <CardTitle>Your profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={avatar || "/placeholder.svg?height=80&width=80&query=eventhive%20user%20avatar"}
            alt="Profile avatar preview"
            className="h-20 w-20 rounded-full ring-2 ring-primary object-cover"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent/20 text-accent">Loyalty: Gold</Badge>
              <Badge variant="outline" className="border-primary text-primary capitalize">
                {role}
              </Badge>
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="file" accept="image/*" onChange={onFile} />
              <span>Upload new photo</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm">Display name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Email</label>
            <Input value={email} disabled />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Tickets", value: 12 },
            { label: "Events", value: 3 },
            { label: "Favorites", value: 9 },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-primary hover:bg-primary/90">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}
