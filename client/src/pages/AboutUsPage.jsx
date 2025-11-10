"use client"

import Header from "../components/Header"
import Footer from "../components/Footer"
import { ArrowRight, Shield, Users, Star, Clock, MessageSquare } from "lucide-react"
import CountUpSection from "../components/CountUpSection"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">About ServiceHub</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted platform connecting skilled professionals with customers. We make finding and booking quality services simple, secure, and seamless.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We're revolutionizing how people access professional services. Our platform connects you with verified experts in various fields, ensuring quality, reliability, and peace of mind for every service booking.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Shield className="text-primary w-6 h-6 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Verified Professionals</h3>
                      <p className="text-muted-foreground">Every service provider undergoes thorough verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Star className="text-primary w-6 h-6 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Quality Assurance</h3>
                      <p className="text-muted-foreground">Maintained through ratings and customer feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="text-primary w-6 h-6 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Efficient Booking</h3>
                      <p className="text-muted-foreground">Quick and easy service scheduling</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/pic2.png"
                  alt="Service professionals at work"
                  className="rounded-2xl shadow-xl p-5"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <CountUpSection />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">1. Choose a Service</h3>
                <p className="text-muted-foreground">
                  Browse through our wide range of professional services and select what you need.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">2. Connect & Book</h3>
                <p className="text-muted-foreground">
                  Chat with professionals, discuss your requirements, and schedule the service.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">3. Get Quality Service</h3>
                <p className="text-muted-foreground">
                  Receive professional service and share your experience through ratings and reviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers who have found reliable professionals through ServiceHub.
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Services
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}