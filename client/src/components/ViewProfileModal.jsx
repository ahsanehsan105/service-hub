import React, { useState, useEffect } from "react"
import BookingModal from "./BookingModal"
import ChatBox from "./ChatBox"
import MapEmbed from "./MapEmbed"
import { useAuth } from "../context/AuthContext"

export default function ViewProfileModal({ professional, onClose }) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const { auth } = useAuth()
  const [hasAcceptedBooking, setHasAcceptedBooking] = useState(false)

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

  if (!professional) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-card w-full max-w-3xl rounded-2xl p-6 z-10 shadow-lg">
        <div className="flex items-start gap-4">
          <img src={professional.image || '/placeholder.svg'} alt={professional.name} className="w-28 h-28 object-cover rounded-lg" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{professional.name}</h2>
            <p className="text-sm text-primary font-medium">{professional.specialty}</p>
            <p className="mt-2 text-sm text-muted-foreground">{professional.bio || 'No bio provided.'}</p>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => setBookingOpen(true)} className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg">Book Now</button>
              {hasAcceptedBooking ? (
                <button onClick={() => setChatOpen(true)} className="px-4 py-2 border border-border rounded-lg">Chat / Negotiate</button>
              ) : (
                <button disabled className="px-4 py-2 border border-border rounded-lg opacity-60 text-xs">Chat available after worker accepts booking</button>
              )}
              <button onClick={onClose} className="ml-auto text-sm text-muted-foreground">Close</button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Location</h3>
          <MapEmbed location={professional.location || { lat: 0, lng: 0, address: professional.address }} />
        </div>
      </div>

      {bookingOpen && (
        <BookingModal professional={professional} onClose={() => setBookingOpen(false)} />
      )}

      {chatOpen && (
        <div className="absolute right-6 bottom-6 z-50">
          <ChatBox worker={professional} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  )
}
