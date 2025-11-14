import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function ServiceProfessionalCard({ professional, serviceType }) {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 group h-full flex flex-col">
        {/* Image Container with Skeleton Loader */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          )}
          <img
            src={professional.image || "/placeholder.svg"}
            alt={professional.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          {professional.verified && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg animate-pulse">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Name */}
          <h3 className="text-lg font-bold text-foreground mb-1">{professional.name}</h3>

          {/* Specialty / primary service */}
          <p className="text-sm text-primary font-medium mb-3">{professional.specialty || (professional.services && professional.services[0] ? professional.services[0].charAt(0).toUpperCase() + professional.services[0].slice(1) : "")}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 transition-all ${i < Math.round(professional.rating) ? "text-yellow-400 drop-shadow-lg" : "text-muted"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{professional.rating || 0}</span>
            <span className="text-xs text-muted-foreground">({professional.reviews || 0} reviews)</span>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {professional.experience || 0} yrs experience
          </div>

          {/* Rate */}
          <div className="mb-4 pb-4 border-b border-border">
            <p className="text-2xl font-bold text-primary">
              ${professional.hourlyRate || 0}
              <span className="text-sm text-muted-foreground">/hr</span>
            </p>
          </div>

          {/* Hire Button */}
          <div className="mt-4">
            <button
              onClick={() => navigate(`/worker/${professional.id}`, { state: { professional } })}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-all text-sm font-semibold hover:shadow-lg hover:shadow-primary/50 group/btn"
            >
              <span className="inline-flex items-center gap-2">
                Hire
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
