import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import MapEmbed from "../components/MapEmbed"
import BookingModal from "../components/BookingModal"
import ChatBox from "../components/ChatBox"

export default function WorkerDetailPage() {
  const { state } = useLocation()
  const professional = state?.professional
  const [openBooking, setOpenBooking] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const { auth } = useAuth()
  const [hasAcceptedBooking, setHasAcceptedBooking] = useState(false)

  useEffect(() => {
    // If professional is missing, we could fetch by id from an API. For now, show fallback.
  }, [professional])

  useEffect(() => {
    if (!auth || !professional) return setHasAcceptedBooking(false)
    try {
      const all = JSON.parse(localStorage.getItem('bookings') || '[]')
      const found = all.find(b => b.workerId === professional.id && b.userId === auth.id && (b.status === 'accepted' || b.status === 'completed'))
      setHasAcceptedBooking(Boolean(found))
    } catch (e) {
      setHasAcceptedBooking(false)
    }
  }, [auth, professional])

  if (!professional) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Worker not found</h1>
          <p className="text-muted-foreground">This profile was opened directly or data is missing.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-card border border-border rounded-2xl p-6 shadow">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={professional.image || '/placeholder.svg'} alt={professional.name} className="w-full md:w-48 h-48 object-cover rounded-lg" />

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{professional.name}</h1>
              <div className="text-sm text-primary font-medium">{professional.specialty}</div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Experience</div>
                  <div className="font-semibold">{professional.experience}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Hourly Rate</div>
                  <div className="font-semibold">${professional.hourlyRate}/hr</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Rating</div>
                  <div className="font-semibold">{professional.rating} ({professional.reviews} reviews)</div>
                </div>
                {/* Phone removed from public profile per recent change */}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold">About</h3>
                <p className="text-sm text-muted-foreground">{professional.bio || 'No bio provided.'}</p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button onClick={() => setOpenBooking(true)} className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg">Book Now</button>
                {hasAcceptedBooking ? (
                  <button onClick={() => setOpenChat(true)} className="px-4 py-2 border border-border rounded-lg">Chat / Negotiate</button>
                ) : (
                  <button disabled className="px-4 py-2 border border-border rounded-lg opacity-60 text-xs">Chat available after worker accepts booking</button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Location</h3>
            <MapEmbed location={professional.location || { lat: 0, lng: 0, address: professional.address }} />
          </div>
        </div>
      </div>

      {openBooking && (
        <BookingModal professional={professional} onClose={() => setOpenBooking(false)} />
      )}

      {openChat && (
        <div className="fixed right-6 bottom-6 z-50">
          <ChatBox worker={professional} onClose={() => setOpenChat(false)} />
        </div>
      )}

      <Footer />
    </main>
  )
}
