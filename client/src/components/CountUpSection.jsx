import CountUp from "./CountUp"
import { CheckCircle2, Award, Star } from "lucide-react"

export default function CountUpSection({ startOn = true }) {
  const stats = [
    {
      icon: CheckCircle2,
      end: 1200,
      suffix: "+",
      label: "Jobs Completed",
      description: "Professional services delivered",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      icon: Award,
      end: 850,
      suffix: "+",
      label: "Verified Pros",
      description: "Trusted service professionals",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500"
    },
    {
      icon: Star,
      end: 4.9,
      suffix: "★",
      label: "Avg. Rating",
      description: "Customer satisfaction score",
      decimals: 1,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of customers and professionals worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group relative h-full"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`} />

                {/* Card */}
                <div className={`relative h-full bg-card border border-border rounded-2xl p-8 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg ${stat.bgColor} group-hover:bg-opacity-50`}>
                  {/* Icon Container */}
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>

                  {/* Stats Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        <CountUp
                          end={stat.end}
                          duration={2000}
                          suffix={stat.suffix}
                          decimals={stat.decimals || 0}
                          startOn={startOn}
                        />
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`h-1 w-12 bg-gradient-to-r ${stat.color} rounded-full mt-6 transition-all duration-300 group-hover:w-full`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex justify-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30" />
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20" />
        </div>
      </div>
    </section>
  )
}
