import { Link } from "react-router-dom"

export default function ServiceCards() {
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

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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
            <Link key={service.id} to={service.link} className="group cursor-pointer">
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
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>

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
