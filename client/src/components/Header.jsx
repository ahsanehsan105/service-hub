"use client"

import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    toast.success("Logged out successfully")
    navigate("/signin")
  }

  const handleProfileClick = () => {
    navigate("/worker-profile")
    setDropdownOpen(false)
  }

  // helper for NavLink classes so active link matches Sign In color (text-primary)
  const navLinkClass = ({ isActive }) =>
    `transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`

  const navButtonClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-colors ${isActive ? "text-primary" : "text-primary hover:bg-primary/10"}`

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">SH</span>
          </div>
          <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
            ServiceHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {auth ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium text-foreground">
                  {auth.fullName || (auth.role === "worker" ? "Worker Profile" : "User Profile")}
                </span>
                <ChevronDown size={18} className="text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <div className="text-sm font-medium text-foreground">{auth.fullName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{auth.role}</div>
                  </div>
                  {auth.role !== "worker" && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        navigate("/bookings")
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      My Bookings
                    </button>
                  )}

                  {auth.role === "worker" && (
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </button>
                  )}

                  {auth.role === "worker" && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        navigate("/worker-dashboard")
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      Worker Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/signin" className={navButtonClass}>
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity ${isActive ? "ring-2 ring-primary/40" : ""}`
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card shadow-inner">
          <div className="px-4 py-4 space-y-3 flex flex-col">
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={(navData) => `${navLinkClass(navData)} block px-4 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors`}
            >
              Services
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={(navData) => `${navLinkClass(navData)} block px-4 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors`}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={(navData) => `${navLinkClass(navData)} block px-4 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors`}
            >
              Contact
            </NavLink>

            <div className="pt-3 border-t border-border space-y-2">
              {auth ? (
                <>
                  {auth.role === "worker" && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleProfileClick()
                      }}
                      className="w-full text-left px-4 py-3 text-base text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                    >
                      <User size={18} />
                      Profile
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-3 text-base text-destructive hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={(navData) => `${navButtonClass(navData)} block w-full text-center`}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}