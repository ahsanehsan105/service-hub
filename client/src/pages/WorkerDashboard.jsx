import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import ChatBox from "../components/ChatBox"

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("bookings") || "[]")
  } catch (e) {
    return []
  }
}

export default function WorkerDashboard() {
  const { auth } = useAuth()
  const [bookings, setBookings] = useState([])
  const [activeChat, setActiveChat] = useState(null) // will hold booking object when chatting with a user
  const [availability, setAvailability] = useState(true)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (!auth) return
    const all = getBookings()
    const mine = all.filter((b) => b.workerId === auth.id)
    setBookings(mine)

    // compute simple balance from accepted/completed bookings
    const bal = mine.reduce((s, b) => (b.status === 'accepted' || b.status === 'completed' ? s + (Number(b.price) || 0) : s), 0)
    setBalance(bal)

    // load availability from localStorage
    try {
      const av = localStorage.getItem(`availability-${auth.id}`)
      setAvailability(av === null ? true : av === 'true')
    } catch (e) {
      setAvailability(true)
    }
  }, [auth])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-grow max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Worker Dashboard</h1>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Incoming Bookings / Notifications</h2>
            {bookings.length === 0 ? (
              <div className="text-muted-foreground">No bookings yet.</div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="border-b last:border-b-0 border-border py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{b.workerName} — {b.slot}</div>
                    <div className="text-sm text-muted-foreground">User ID: {b.userId} • ${b.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                      <button onClick={() => setActiveChat(b)} className="px-3 py-1 rounded-lg border border-border">Chat</button>
                      <button onClick={() => {
                        // mark as accepted for now
                        const all = getBookings()
                        const next = all.map(x => x.id === b.id ? {...x, status: 'accepted'} : x)
                        localStorage.setItem('bookings', JSON.stringify(next))
                        const mine = next.filter(x => x.workerId === auth.id)
                        setBookings(mine)
                        // update balance
                        const bal = mine.reduce((s, it) => (it.status === 'accepted' || it.status === 'completed' ? s + (Number(it.price) || 0) : s), 0)
                        setBalance(bal)
                      }} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground">Accept</button>
                    </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Your Services</h2>
            <div className="text-sm text-muted-foreground">Manage your offered services from your profile page.</div>
          </div>
        </div>
      </div>

      {activeChat && (
        <div className="fixed right-6 bottom-6">
          {/* activeChat is a booking object; chat with the user who made the booking */}
          <ChatBox worker={{ id: activeChat.userId, name: activeChat.userName || 'Customer' }} onClose={() => setActiveChat(null)} />
        </div>
      )}

      {/* Availability & balance widget */}
      <div className="fixed left-6 bottom-6">
        <div className="bg-card border border-border rounded-lg p-4 shadow">
          <div className="font-semibold">Availability</div>
          <div className="mt-2 flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={availability} onChange={(e) => {
                setAvailability(e.target.checked)
                try { localStorage.setItem(`availability-${auth.id}`, String(e.target.checked)) } catch(e){}
              }} />
              <span className="text-sm text-muted-foreground">Visible for bookings</span>
            </label>
          </div>
          <div className="mt-3 text-sm">
            <div className="text-muted-foreground">Payment balance</div>
            <div className="font-semibold">${balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
