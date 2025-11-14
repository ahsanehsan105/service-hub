"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function HeroSection({ isLoaded, onFindService }) {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const { ref, isVisible } = useScrollAnimation()

  const handleLearnMore = () => {
    navigate("/services")
  }

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div className={`order-2 lg:order-1 text-left transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground leading-tight transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              Local experts. Reliable results.
              <span className={`block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mt-3 text-3xl sm:text-4xl font-bold transition-all duration-1000 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>On-demand service, done right.</span>
            </h1>

            <p className={`text-lg sm:text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Book vetted professionals for home repairs, installations, and maintenance. Fast booking, transparent pricing,
              and a satisfaction guarantee.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-start mb-8 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/50 inline-flex items-center justify-center gap-2 group"
              >
                Find Service
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={handleLearnMore}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all text-lg font-semibold hover:shadow-lg"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className={`order-1 lg:order-2 flex items-center justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/pic1.jpg" 
                alt="team" 
                className={`relative w-full max-w-xl rounded-2xl shadow-2xl object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? "blur-0" : "blur-sm"}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
