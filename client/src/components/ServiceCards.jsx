import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function ServiceCards() {
  const { ref, isVisible } = useScrollAnimation()
  const cardRefsMap = useRef({})
  const [visibleCards, setVisibleCards] = useState({})

  const services = [
    {
      id: "plumber",
      name: "Plumber",
      icon: "🔧",
      description: "Professional plumbing services for repairs, installations, and maintenance",
      benefits: ["Emergency repairs", "Leak detection", "Installation", "Maintenance plans"],
      color: "from-blue-500 to-blue-600",
      link: "/services/plumber",
      image: "/professional-plumber-tools.jpg",
    },
    {
      id: "electrician",
      name: "Electrician",
      icon: "⚡",
      description: "Expert electrical services including wiring, repairs, and installations",
      benefits: ["Safety inspections", "Rewiring", "Panel upgrades", "24/7 emergency"],
      color: "from-yellow-500 to-yellow-600",
      link: "/services/electrician",
      image: "/electrician-tools-equipment.jpg",
    },
    {
      id: "mechanic",
      name: "Mechanic",
      icon: "🚗",
      description: "Professional automotive repair and maintenance services",
      benefits: ["Engine repair", "Diagnostics", "Brake service", "Oil changes"],
      color: "from-red-500 to-red-600",
      link: "/services/mechanic",
      image: "/car-mechanic-service-station.jpg",
    },
    {
      id: "technician",
      name: "Technician",
      icon: "💻",
      description: "Expert technical support for computers, networks, and IT systems",
      benefits: ["IT support", "Network setup", "Data recovery", "System maintenance"],
      color: "from-purple-500 to-purple-600",
      link: "/services/technician",
      image: "/tech-support-computer-repair.jpg",
    },
  ]

  // Setup observers for each card
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

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our four core professional services. Each backed by verified, experienced professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link 
              key={service.id} 
              to={service.link} 
              ref={(el) => {
                if (el) {
                  cardRefsMap.current[index] = el
                }
              }}
              className={`group cursor-pointer transition-all duration-700 ${
                visibleCards[index]
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-12"
              }`}
            >
              <div className="relative h-full bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary hover:scale-105">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`text-4xl mb-4 group-hover:scale-110 transition-all duration-300 ${visibleCards[index] && index % 2 === 0 ? "animate-bounce" : ""}`} style={{animationDelay: `${index * 0.1}s`}}>{service.icon}</div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{service.description}</p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-6">
                    {service.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-2 px-4 bg-gradient-to-r ${service.color} text-white font-semibold rounded-lg group-hover:shadow-lg transition-all`}
                  >
                    View {service.name}s
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
