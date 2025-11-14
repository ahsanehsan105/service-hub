"use client"

import Header from "../components/Header"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Users, Star, Clock, MessageSquare, CheckCircle2, Award } from "lucide-react"
import CountUpSection from "../components/CountUpSection"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import { useState, useEffect, useRef } from "react"

export default function AboutUsPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation()
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation()
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation()
  const { ref: whyRef, isVisible: whyVisible } = useScrollAnimation()
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation()
  const featureRefsMap = useRef({})
  const [visibleFeatures, setVisibleFeatures] = useState({})
  const whyRefsMap = useRef({})
  const [visibleWhyItems, setVisibleWhyItems] = useState({})

  // Setup observers for features
  useEffect(() => {
    const observers = {}
    
    Object.entries(featureRefsMap.current).forEach(([index, featureRef]) => {
      if (!featureRef) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFeatures(prev => ({ ...prev, [index]: true }))
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(featureRef)
      observers[index] = observer
    })

    return () => {
      Object.values(observers).forEach(observer => observer && observer.disconnect())
    }
  }, [])

  // Setup observers for why items
  useEffect(() => {
    const observers = {}
    
    Object.entries(whyRefsMap.current).forEach(([index, whyRef]) => {
      if (!whyRef) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleWhyItems(prev => ({ ...prev, [index]: true }))
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(whyRef)
      observers[index] = observer
    })

    return () => {
      Object.values(observers).forEach(observer => observer && observer.disconnect())
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          </div>
          <div className={`max-w-7xl mx-auto text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About ServiceHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted platform connecting skilled professionals with customers. We make finding and booking quality services simple, secure, and seamless.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section ref={missionRef} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${missionVisible ? "opacity-100" : "opacity-0"}`}>
              <div className={`transition-all duration-700 ${missionVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We're revolutionizing how people access professional services. Our platform connects you with verified experts in various fields, ensuring quality, reliability, and peace of mind for every service booking.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <Shield className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Verified Professionals</h3>
                      <p className="text-muted-foreground text-sm">Every service provider undergoes thorough verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <Star className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Quality Assurance</h3>
                      <p className="text-muted-foreground text-sm">Maintained through ratings and customer feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <Clock className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Efficient Booking</h3>
                      <p className="text-muted-foreground text-sm">Quick and easy service scheduling</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`relative group transition-all duration-700 delay-300 ${missionVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src="/pic2.png"
                  alt="Service professionals at work"
                  className="relative rounded-2xl shadow-3xl p-5 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section with Modern Design */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/50 via-background to-muted/30">
          <div className="max-w-7xl mx-auto">
            <CountUpSection />
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Choose a Service", description: "Browse through our wide range of professional services and select what you need.", icon: Users },
                { title: "Connect & Book", description: "Chat with professionals, discuss your requirements, and schedule the service.", icon: MessageSquare },
                { title: "Get Quality Service", description: "Receive professional service and share your experience through ratings and reviews.", icon: Star }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      if (el) {
                        featureRefsMap.current[index] = el
                      }
                    }}
                    className={`group relative transition-all duration-700 ${
                      visibleFeatures[index]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-card border border-border rounded-xl p-8 transition-all duration-300 group-hover:border-primary/50 h-full">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="text-primary font-bold">{index + 1}.</span> {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={whyRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${whyVisible ? "opacity-100" : "opacity-0"}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Why Choose ServiceHub?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: CheckCircle2, title: "Trusted & Verified", description: "All professionals are thoroughly vetted and verified for quality and reliability.", color: "text-green-500" },
                { icon: Award, title: "Quality Guaranteed", description: "Customer ratings and reviews ensure consistent quality service standards.", color: "text-blue-500" },
                { icon: Clock, title: "Quick & Easy", description: "Find and book professional services in just a few minutes, anytime.", color: "text-purple-500" },
                { icon: Shield, title: "Secure & Safe", description: "Your information and transactions are protected with enterprise-grade security.", color: "text-amber-500" }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      if (el) {
                        whyRefsMap.current[index] = el
                      }
                    }}
                    className={`flex gap-4 group transition-all duration-700 ${
                      visibleWhyItems[index]
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-8"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-${item.color.split('-')[1]}-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-${item.color.split('-')[1]}-500/20 transition-colors`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-50 -translate-y-1/2" />
          </div>
            <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${ctaVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers who have found reliable professionals through ServiceHub.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/50"
            >
              Browse Services
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}