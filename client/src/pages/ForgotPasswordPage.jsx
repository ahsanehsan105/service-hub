"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email") // email, otp, reset
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // inline error box removed; use toast for errors
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_URL || "https://service-hub-green.vercel.app/api/v1"

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
  // use toast for errors

    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
        if (!res.ok) {
          const err = json.error || json.message || "Could not send reset code"
          toast.error(err)
        } else {
        toast.success("Reset code sent. Check your email.")
        setStep("otp")
        setTimer(60)
        setCanResend(false)
      }
    } catch (err) {
      console.error(err)
      toast.error(String(err))
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) {
        const err = json.error || json.message || "Could not resend reset code"
        toast.error(err)
      } else {
        toast.success("Reset code resent. Check your email.")
        setTimer(60)
        setCanResend(false)
      }
    } catch (err) {
      console.error(err)
      toast.error(String(err))
    }
    setLoading(false)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 3) {
      document.getElementById(`forgot-otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault()
    const otpCode = otp.join("")
    if (otpCode.length !== 4) {
      toast.error("Please enter all 4 digits")
      return
    }

    // Move to reset step; actual verification happens when submitting new password
    // For UX we move to reset step (actual verification happens in reset request)
    setLoading(true)
    setTimeout(() => {
      setStep("reset")
      setLoading(false)
    }, 400)
  }

  // Countdown timer for OTP resend availability
  useEffect(() => {
    let interval
    if (step === "otp" && timer > 0 && !canResend) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [step, timer, canResend])

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    try {
      const otpCode = otp.join("")
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode, newPassword }),
      })
      const json = await res.json()
      if (!res.ok) {
        const err = json.error || json.message || "Could not reset password"
        toast.error(err)
      } else {
        toast.success("Password updated. You can sign in now.")
        navigate("/signin")
      }
    } catch (err) {
      console.error(err)
      toast.error(String(err))
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
              {step === "email" && (
                <p className="text-muted-foreground">Enter your email address</p>
              )}
              {step === "otp" && (
                <div>
                  <p className="text-muted-foreground">Enter the 4-digit code sent to <span className="font-medium">{email}</span></p>
                </div>
              )}
              {step === "reset" && (
                <p className="text-muted-foreground">Create a new password</p>
              )}
            </div>

            
            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`forgot-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-16 h-16 text-center text-2xl font-bold border-2 border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-primary hover:text-secondary font-semibold transition-colors"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground">Resend in <span className="font-semibold text-primary">{timer}s</span></p>
                )}
              </div>
              </>
            )}

            {/* Step 3: New Password */}
              {step === "reset" && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Back to Sign In */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link to="/signin" className="text-primary hover:text-secondary font-semibold transition-colors">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
