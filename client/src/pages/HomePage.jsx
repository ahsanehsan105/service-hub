import { useState, useEffect } from "react"
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Ready to find your service provider?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with verified professionals instantly. Quality service, one click away.
        </p>
        <a
          href="/services"
          className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Get Started Today
        </a>
      </div>
    </section>
  )
}
