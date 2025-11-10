"use client"

import { createContext, useState, useContext, useEffect } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth))
    }
    setLoading(false)
  }, [])

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"

  // Note: signup, OTP verification and password reset flows are handled by their
  // respective pages/components and call the APIs directly. AuthContext is only
  // responsible for storing and exposing the current authenticated user and token.

  // Save authenticated user and token (pages call this after successful login/verify)
  const saveAuth = (user, token) => {
    if (!user) return
    setAuth(user)
    try {
      localStorage.setItem("auth", JSON.stringify(user))
      if (token) localStorage.setItem("token", token)
    } catch (err) {
      console.warn("Could not persist auth to localStorage", err)
    }
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem("auth")
    localStorage.removeItem("token")
  }

  const updateWorkerProfile = (profileData) => {
    const updated = {
      ...auth,
      profileComplete: true,
      ...profileData,
    }
    setAuth(updated)
    localStorage.setItem("auth", JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        saveAuth,
        logout,
        updateWorkerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
