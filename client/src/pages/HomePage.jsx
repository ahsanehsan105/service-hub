import { useState, useEffect } from "react"
import { ArrowRight, Zap } from "lucide-react"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import ServiceCards from "../components/ServiceCards"
import ContactSection from "../components/ContactSection"
import CountUpSection from "../components/CountUpSection"
import Footer from "../components/Footer"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      <HeroSection isLoaded={isLoaded} />
      <ServiceCards />
      <CountUpSection startOn={isLoaded} />
      <CTASection />
      <ContactSection />
      <Footer />
    </main>
  )
}

function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          {/* Card Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Card Content */}
          <div className="relative bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 backdrop-blur-sm rounded-2xl p-12 sm:p-16 text-center transition-all duration-300 group-hover:border-primary/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary mb-6 animate-pulse">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Ready to find your service provider?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with verified professionals instantly. Quality service, one click away. Join thousands of satisfied customers today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all duration-300 group/btn hover:shadow-lg hover:shadow-primary/50"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-3 bg-muted text-foreground font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300"
              >
                Learn More
              </a>
            </div>

            {/* Bottom info */}
            <div className="mt-8 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Verified professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Secure booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">4.9★ Average rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
