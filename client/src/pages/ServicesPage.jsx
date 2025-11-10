"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ServiceCards from "../components/ServiceCards"

export default function ServicesPage() {
  const navigate = useNavigate()
  const { auth } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto">
          <ServiceCards />
          
          {/* Info Box */}
          {!auth && (
            <div className="mt-12 p-8 bg-primary/10 border-2 border-primary rounded-2xl text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Sign In to Browse Professionals</h3>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to view available service professionals and book appointments.
              </p>
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
