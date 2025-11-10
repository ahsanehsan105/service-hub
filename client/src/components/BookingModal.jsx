import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("bookings") || "[]")
  } catch (e) {
    return []
  }
}

function saveBooking(b) {
  const all = getBookings()
  all.push(b)
  localStorage.setItem("bookings", JSON.stringify(all))
}

export default function BookingModal({ professional, onClose }) {
  const { auth } = useAuth()
  const [bookedSlots, setBookedSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [proposedPrice, setProposedPrice] = useState(professional.hourlyRate || 0)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [address, setAddress] = useState("")

  const availableSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
  ]

  useEffect(() => {
    const all = getBookings()
    // filter bookings for this worker and selected date
    setBookedSlots(all.filter((b) => b.workerId === professional.id && b.date === selectedDate))
    // try to prefill address from auth profile
    if (auth && auth.address) setAddress(auth.address)
  }, [professional, selectedDate])

  const handleConfirm = () => {
    if (!auth) return alert("Please sign in to book")
    if (!selectedSlot) return alert("Please choose a slot")
    if (!address || address.trim().length < 5) return alert('Please enter a valid address for the booking')

    setProcessing(true)
    setTimeout(() => {
      const booking = {
        id: Date.now(),
        userId: auth.id,
        userName: auth.fullName || auth.name || 'Customer',
        workerId: professional.id,
        workerName: professional.name,
        slot: selectedSlot,
        date: selectedDate,
        status: "pending", // worker must accept to "accepted" before chat is allowed
        price: Number(proposedPrice) || 0,
        paymentMethod,
        address,
        createdAt: new Date().toISOString(),
      }
      saveBooking(booking)
      setProcessing(false)
      onClose()
      // Do not auto-open chat. Chat becomes available once worker accepts (status -> accepted).
      alert("Booking created — it is pending acceptance by the worker. You will be able to chat once the worker accepts the job.")
    }, 900)
  }

  const isSlotBooked = (slot) => bookedSlots.some((b) => b.slot === slot)

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-card w-full max-w-2xl rounded-2xl p-6 z-10 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Book {professional.name}</h3>
            <p className="text-sm text-muted-foreground">Select date, pick a slot and optionally propose a price.</p>
          </div>
          <div className="text-sm text-muted-foreground">Rate: <span className="font-semibold">${professional.hourlyRate}/hr</span></div>
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Available Slots</label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button key={slot} disabled={isSlotBooked(slot)} onClick={() => setSelectedSlot(slot)} className={`px-3 py-2 rounded-lg text-sm border ${selectedSlot === slot ? "border-primary bg-primary/5" : "border-border"} ${isSlotBooked(slot) ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"}`}>
                  {slot}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Booked slots on {selectedDate}: {bookedSlots.length}</div>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Propose Price ($)</label>
            <input type="number" value={proposedPrice} onChange={(e) => setProposedPrice(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Payment Method</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2"><input type="radio" name="pm" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /> Card</label>
              <label className="flex items-center gap-2"><input type="radio" name="pm" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} /> Wallet</label>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Note: Cash payments have been removed. Payment is simulated for demo purposes.</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-muted-foreground mb-1">Service Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address where service is needed" className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          <button onClick={handleConfirm} disabled={processing} className="ml-auto px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg">
            {processing ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  )
}
