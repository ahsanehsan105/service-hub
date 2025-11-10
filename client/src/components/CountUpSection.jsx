import CountUp from "./CountUp"

export default function CountUpSection({ startOn = true }) {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <CountUp end={1200} duration={1800} suffix="+" startOn={startOn} />
            <p className="text-sm text-muted-foreground mt-2">Jobs Completed</p>
          </div>
          <div>
            <CountUp end={850} duration={1800} suffix="+" startOn={startOn} />
            <p className="text-sm text-muted-foreground mt-2">Verified Pros</p>
          </div>
          <div>
            <CountUp end={4.9} duration={1500} decimals={1} suffix="" startOn={startOn} />
            <p className="text-sm text-muted-foreground mt-2">Avg. Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
