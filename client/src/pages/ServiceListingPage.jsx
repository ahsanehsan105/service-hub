"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ServiceProfessionalCard from "../components/ServiceProfessionalCard"
import FiltersSidebar from "../components/FiltersSidebar"

// Removed hard-coded demo professionals. We'll fetch real workers from the API.

const serviceNames = {
  plumber: "Plumber",
  electrician: "Electrician",
  mechanic: "Mechanic",
  technician: "Technician",
}

export default function ServiceListingPage() {
  const { serviceType } = useParams()
  const [filters, setFilters] = useState({
    minRating: 0,
    minExperience: 0,
    sortBy: "rating",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [professionals, setProfessionals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const abort = { aborted: false }
    setIsLoading(true)
    const API_BASE = import.meta.env.VITE_API_URL || "https://service-hub-green.vercel.app/api/v1"
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/workers?service=${serviceType}`)
        const json = await res.json()
        if (!res.ok) {
          console.warn("Could not load workers", json.error || json.message)
          if (!abort.aborted) setProfessionals([])
          return
        }
        if (!abort.aborted) setProfessionals(json.workers || [])
      } catch (err) {
        console.error("fetch workers error", err)
        if (!abort.aborted) setProfessionals([])
      } finally {
        if (!abort.aborted) setIsLoading(false)
      }
    })()
    return () => { abort.aborted = true }
  }, [serviceType])

  const serviceName = serviceNames[serviceType] || "Service"

  const filteredAndSorted = useMemo(() => {
    const result = professionals
      .filter((pro) => {
        const matchesRating = (pro.rating || 0) >= filters.minRating
        const matchesExperience = Number(pro.experience || 0) >= filters.minExperience
        const matchesSearch =
          (pro.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (pro.bio || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(pro.services) ? pro.services.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) : false)
        return matchesRating && matchesExperience && matchesSearch
      })

    if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (filters.sortBy === "experience") {
      result.sort((a, b) => Number.parseInt(b.experience) - Number.parseInt(a.experience))
    } else if (filters.sortBy === "price") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate)
    }

    return result
  }, [professionals, filters, searchQuery])

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="h-48 bg-muted animate-pulse" />
      <div className="p-6">
        <div className="h-6 bg-muted rounded-lg mb-3 animate-pulse" />
        <div className="h-4 bg-muted rounded-lg mb-4 w-1/2 animate-pulse" />
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
        <div className="h-4 bg-muted rounded-lg mb-4 animate-pulse" />
        <div className="h-8 bg-muted rounded-lg mb-4 animate-pulse" />
        <div className="h-10 bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">{serviceName}s</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Professional {serviceName}s</h1>
          <p className="text-lg text-muted-foreground">
            Browse verified and experienced {serviceName.toLowerCase()}s ready to help
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <FiltersSidebar
              filters={filters}
              setFilters={setFilters}
              onSearchChange={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>

          <div className="md:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                {isLoading ? "Loading..." : `Showing ${filteredAndSorted.length} results`}
              </p>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredAndSorted.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSorted.map((professional, index) => (
                  <div
                    key={professional.id}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <ServiceProfessionalCard
                      professional={professional}
                      serviceType={serviceType}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No professionals found matching your criteria</p>
                <button
                  onClick={() => {
                    setFilters({ minRating: 0, minExperience: 0, sortBy: "rating" })
                    setSearchQuery("")
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
