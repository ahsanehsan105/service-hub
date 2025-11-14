"use client"

import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactSection from "../components/ContactSection"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function ContactUsPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation()
  const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation()
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation()
  const cardRefsMap = useRef({})
  const [visibleCards, setVisibleCards] = useState({})
  const faqRefsMap = useRef({})
  const [visibleFaqs, setVisibleFaqs] = useState({})

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@servicehub.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Service Lane, Tech City, TC 12345",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "24/7 Support Available",
      color: "from-orange-500 to-red-500"
    }
  ]

  const faqs = [
    {
      question: "How do I book a service?",
      answer: "Browse our services, select a professional, and book directly through their profile. You can also chat with them first to discuss your requirements."
    },
    {
      question: "Are your professionals verified?",
      answer: "Yes, all service providers undergo thorough verification including background checks and skill assessment before being listed on our platform."
    },
    {
      question: "What if I need to cancel a booking?",
      answer: "You can cancel a booking up to 24 hours before the scheduled time without any charges. Late cancellations may incur a fee."
    },
    {
      question: "How can I become a service provider?",
      answer: "Sign up as a professional, complete our verification process, and create your profile. Our team will guide you through the onboarding process."
    }
  ]

  // Setup observers for info cards
  useEffect(() => {
    const observers = {}
    
    Object.entries(cardRefsMap.current).forEach(([index, cardRef]) => {
      if (!cardRef) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => ({ ...prev, [index]: true }))
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(cardRef)
      observers[index] = observer
    })

    return () => {
      Object.values(observers).forEach(observer => observer && observer.disconnect())
    }
  }, [])

  // Setup observers for FAQ items
  useEffect(() => {
    const observers = {}
    
    Object.entries(faqRefsMap.current).forEach(([index, faqRef]) => {
      if (!faqRef) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFaqs(prev => ({ ...prev, [index]: true }))
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(faqRef)
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
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help. Connect with our team and get the support you need.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section ref={infoRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      if (el) {
                        cardRefsMap.current[index] = el
                      }
                    }}
                    className={`group relative transition-all duration-700 ${
                      visibleCards[index]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${info.color} opacity-0 group-hover:opacity-20 rounded-xl blur-xl transition-opacity`} />
                    <div className="relative bg-card border border-border rounded-xl p-6 transition-all duration-300 group-hover:border-primary/50 h-full">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${info.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <ContactSection />

        {/* FAQ Section */}
        <section ref={faqRef} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${faqVisible ? "opacity-100" : "opacity-0"}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">Find answers to common questions about our platform</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) {
                      faqRefsMap.current[index] = el
                    }
                  }}
                  className={`group bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 ${
                    visibleFaqs[index]
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                >
                  <h3 className="font-semibold mb-2 text-lg text-foreground group-hover:text-primary transition-colors">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}