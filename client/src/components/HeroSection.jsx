"use client"

import { useNavigate } from "react-router-dom"

export default function HeroSection({ isLoaded, onFindService }) {
  const navigate = useNavigate()

  const handleLearnMore = () => {
    navigate("/services")
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isLoaded ? "opacity-100" : "opacity-0 translate-y-6"}`}>
          {/* Left: Content */}
          <div className="order-2 lg:order-1 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground leading-tight">
              Local experts. Reliable results.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mt-3 text-3xl sm:text-4xl font-bold">On-demand service, done right.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
              Book vetted professionals for home repairs, installations, and maintenance. Fast booking, transparent pricing,
              and a satisfaction guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-start mb-8">
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                Find Service
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={handleLearnMore}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-lg font-semibold"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <img src="/pic1.jpg" alt="team" className="w-full max-w-xl rounded-2xl shadow-2xl object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
