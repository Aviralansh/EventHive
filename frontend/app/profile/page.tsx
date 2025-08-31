"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAvatar } from "@/components/user/user-avatar"
import { AlertBanner } from "@/components/common/alert-banner"
import { meReq, myBookingsReq, myEventsReq } from "@/lib/api"

type Me = {
  full_name: string
  email: string
  phone?: string
  role: "attendee" | "organizer"
  loyalty_points: number
}

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null)
  const [bookings, setBookings] = useState<number>(0)
  const [events, setEvents] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      try {
        const [meData, bookingsData, eventsData] = await Promise.all([meReq(), myBookingsReq(), myEventsReq()])
        if (cancelled) return
        setMe({
          full_name: meData.full_name,
          email: meData.email,
          phone: meData.phone,
          role: meData.role,
          loyalty_points: meData.loyalty_points,
        })
        setBookings(Array.isArray(bookingsData) ? bookingsData.length : 0)
        setEvents(Array.isArray(eventsData) ? eventsData.length : 0)
        setError(null)
      } catch (err: any) {
        if (cancelled) return
        setError(err?.message || "Unable to load profile")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const level = useMemo(() => {
    const pts = me?.loyalty_points || 0
    if (pts >= 1000) return { name: "Gold", color: "bg-amber-500" }
    if (pts >= 500) return { name: "Silver", color: "bg-slate-400" }
    return { name: "Bronze", color: "bg-orange-400" }
  }, [me?.loyalty_points])

  if (error) {
    return (
      <main className="p-6">
        <AlertBanner type="error" message={error} />
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-4xl grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile
              <Badge variant="secondary" className="capitalize">
                {me?.role || "guest"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {isLoading ? (
              <p className="text-sm text-slate-600">Loading profile...</p>
            ) : (
              <>
                <UserAvatar name={me?.full_name || "User"} src={null} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input id="full_name" defaultValue={me?.full_name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={me?.email} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={me?.phone} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="grid gap-2">
                    <p className="text-sm text-slate-600">Loyalty points</p>
                    <div className="h-2 w-64 bg-slate-200 rounded">
                      <div
                        className={`h-2 rounded ${level.color}`}
                        style={{ width: `${Math.min(100, (me?.loyalty_points || 0) / 10)}%` }}
                      />
                    </div>
                    <p className="text-sm">
                      {me?.loyalty_points || 0} pts · {level.name}
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Save changes</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{bookings}</p>
              <p className="text-sm text-slate-600">Your total bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{events}</p>
              <p className="text-sm text-slate-600">Events you organize</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Role:&nbsp;<span className="font-medium capitalize">{me?.role || "guest"}</span>
              </p>
              <p className="text-sm text-slate-600">Keep engaging to level up!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
