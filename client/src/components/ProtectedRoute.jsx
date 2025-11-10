"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { auth, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!auth) {
    return <Navigate to="/signin" replace />
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
