import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("bookings") || "[]")
  } catch (e) {
    return []
  }
}

export default function BookingsPage() {
  const { auth } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const all = getBookings()
    if (auth) {
      const mine = all.filter((b) => b.userId === auth.id)
      setBookings(mine)
    }
  }, [auth])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-grow max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="p-6 bg-card border border-border rounded-lg text-muted-foreground">You have no bookings yet.</div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Ongoing / Upcoming</h2>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length === 0 && <div className="text-muted-foreground">No ongoing bookings.</div>}
                {bookings.filter(b => b.status === 'pending' || b.status === 'accepted').map(b => (
                  <div key={b.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{b.workerName}</div>
                      <div className="text-sm text-muted-foreground">{b.date} • {b.slot} • ${b.price}</div>
                      <div className="text-xs text-muted-foreground">Status: {b.status}</div>
                      <div className="text-xs text-muted-foreground">Address: {b.address || '—'}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => alert(JSON.stringify(b, null, 2))} className="px-3 py-1 rounded-lg border border-border text-sm">View Invoice</button>
                        <a href="/contact" className="px-3 py-1 rounded-lg border border-border text-sm">Support</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">History</h2>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length === 0 && <div className="text-muted-foreground">No history yet.</div>}
                {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(b => (
                  <div key={b.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{b.workerName}</div>
                      <div className="text-sm text-muted-foreground">{b.date} • {b.slot} • ${b.price}</div>
                      <div className="text-xs text-muted-foreground">Status: {b.status}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
