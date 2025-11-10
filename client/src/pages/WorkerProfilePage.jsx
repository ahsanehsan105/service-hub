"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Save, CheckCircle } from "lucide-react"

export default function WorkerProfilePage() {
  const { auth, saveAuth } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: auth?.fullName || "",
    city: auth?.city || "",
    experience: auth?.experience || "",
    hourlyRate: auth?.hourlyRate || "",
    bio: auth?.bio || "",
    services: auth?.services || [],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const services = ["plumber", "electrician", "technician", "mechanic"]
  const serviceDisplayNames = {
    plumber: "Plumber",
    electrician: "Electrician",
    mechanic: "Mechanic",
    technician: "Technician",
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      // services checkbox
      const svc = value
      setFormData((prev) => {
        const exists = prev.services.includes(svc)
        return {
          ...prev,
          services: exists ? prev.services.filter((s) => s !== svc) : [...prev.services, svc],
        }
      })
      return
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/workers/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          city: formData.city,
          experience: Number(formData.experience) || 0,
          hourlyRate: Number(formData.hourlyRate) || 0,
          bio: formData.bio,
          services: formData.services,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        const err = json.error || json.message || "Could not save profile"
        throw new Error(err)
      }

      // Update auth state to mark profile completed and include name/role
      const existingAuthRaw = localStorage.getItem("auth")
      const existingAuth = existingAuthRaw ? JSON.parse(existingAuthRaw) : null
      const updatedUser = {
        ...(existingAuth || auth || {}),
        fullName: json.worker.fullName,
        profileCompleted: true,
      }
      const tokenStored = localStorage.getItem("token")
      saveAuth(updatedUser, tokenStored)

      setSuccess(true)
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      console.error(err)
      toast.error(String(err))
    } finally {
      setLoading(false)
    }
  }

  if (!auth || auth.role !== "worker") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">This page is only for service workers.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Go Home
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
              <p className="text-muted-foreground">Tell us about your services so you can start receiving bookings</p>
              <div className="mt-3 text-sm text-muted-foreground">Signed in as <span className="font-semibold text-foreground">{auth?.fullName || auth?.email}</span> — <span className="uppercase font-medium text-xs">{auth?.role}</span></div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="font-semibold text-green-800">Profile Completed!</p>
                  <p className="text-sm text-green-700">Redirecting to home...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Services (checkboxes) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Service types</label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((s) => (
                    <label key={s} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="services"
                        value={s}
                        checked={formData.services.includes(s)}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className="text-sm">{serviceDisplayNames[s]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Years of experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Hourly rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hourly rate ($)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Short bio */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Short bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {loading ? "Saving..." : "Complete Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
