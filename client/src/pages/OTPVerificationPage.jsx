"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""])
  // error messages are shown via toast; we keep no inline error state
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [pendingEmail, setPendingEmail] = useState(null)
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const API_BASE = import.meta.env.VITE_API_URL || "https://service-hub-green.vercel.app/api/v1"

  useEffect(() => {
    try {
      const pending = localStorage.getItem("pendingSignup")
      const parsed = pending ? JSON.parse(pending) : null
      if (parsed && parsed.email) setPendingEmail(parsed.email)
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    let interval
    if (timer > 0 && !canResend) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer, canResend])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  // clear not necessary; use toasts for errors

    const otpCode = otp.join("")
    if (otpCode.length !== 4) {
      toast.error("Please enter all 4 digits")
      return
    }

    const verifyOtp = async () => {
      setLoading(true)
      try {
        const pending = localStorage.getItem("pendingSignup")
        const parsed = pending ? JSON.parse(pending) : null
        const email = parsed?.email
        if (!email) {
          toast.error("No pending signup found. Please sign up first.")
          return
        }

        const res = await fetch(`${API_BASE}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        })
        const json = await res.json()
        if (!res.ok) {
          const err = json.error || json.message || "OTP verification failed"
          toast.error(err)
          return
        }
        
        // Expecting user and token in response
        const user = json.user
        const token = json.token
        if (user && token) {
          saveAuth(user, token)
          try { localStorage.removeItem("pendingSignup") } catch (e) {}
          toast.success("Account created and signed in")
          // If the new account is a worker, prompt to complete profile and redirect there
          if (user.role === "worker") {
            toast("Please complete your profile to start providing services.")
            navigate("/worker-profile")
            return
          }
          navigate("/")
          return
        }

        // If server didn't return token/user, try logging in with saved pending signup credentials
        try {
          const pendingRaw = localStorage.getItem("pendingSignup")
          const pending = pendingRaw ? JSON.parse(pendingRaw) : null
          if (pending && pending.email && pending.password) {
            const loginRes = await fetch(`${API_BASE}/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: pending.email, password: pending.password }),
            })
            const loginJson = await loginRes.json()
            if (loginRes.ok && loginJson.user && loginJson.token) {
              saveAuth(loginJson.user, loginJson.token)
              try { localStorage.removeItem("pendingSignup") } catch (e) {}
              toast.success("Account created and signed in")
              if (loginJson.user.role === "worker") {
                toast("Please complete your profile to start providing services.")
                navigate("/worker-profile")
                return
              }
              navigate("/")
              return
            }
          }
        } catch (innerErr) {
          console.error("fallback login error:", innerErr)
        }

        // Fallback: prompt user to sign in manually
        toast.success("Account verified. Please sign in.")
        navigate("/signin")
      } catch (err) {
        console.error(err)
        toast.error(String(err))
      } finally {
        setLoading(false)
      }
    }
    
    verifyOtp()
  }

  const handleResend = () => {
    ;(async () => {
      setLoading(true)
      try {
        const pendingRaw = localStorage.getItem("pendingSignup")
        const pending = pendingRaw ? JSON.parse(pendingRaw) : null
        const email = pending?.email || pendingEmail
        if (!email) {
          toast.error("No signup email found to resend OTP")
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE}/signup/resend-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const json = await res.json()
        if (!res.ok) {
          const err = json.error || json.message || "Could not resend OTP"
          toast.error(err)
        } else {
          toast.success("OTP resent. Check your email.")
          setTimer(60)
          setCanResend(false)
          setOtp(["", "", "", ""])
        }
      } catch (err) {
        console.error(err)
        toast.error(String(err))
      }
      setLoading(false)
    })()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Verify Your Email</h1>
              {pendingEmail ? (
                <p className="text-muted-foreground">Enter the 4-digit code sent to <span className="font-medium">{pendingEmail}</span></p>
              ) : (
                <p className="text-muted-foreground">Enter the 4-digit code we sent to your email</p>
              )}
            </div>

            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex gap-3 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-primary hover:text-secondary font-semibold transition-colors"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend in <span className="font-semibold text-primary">{timer}s</span>
                </p>
              )}
            </div>

            {/* (Removed demo OTP) */}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
