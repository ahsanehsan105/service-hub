"use client"

import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactSection from "../components/ContactSection"


export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help. Connect with our team and get the support you need.
            </p>
          </div>
        </section>

        <ContactSection />

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">How do I book a service?</h3>
                <p className="text-muted-foreground">Browse our services, select a professional, and book directly through their profile. You can also chat with them first to discuss your requirements.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">Are your professionals verified?</h3>
                <p className="text-muted-foreground">Yes, all service providers undergo thorough verification including background checks and skill assessment before being listed on our platform.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">What if I need to cancel a booking?</h3>
                <p className="text-muted-foreground">You can cancel a booking up to 24 hours before the scheduled time without any charges. Late cancellations may incur a fee.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">How can I become a service provider?</h3>
                <p className="text-muted-foreground">Sign up as a professional, complete our verification process, and create your profile. Our team will guide you through the onboarding process.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}