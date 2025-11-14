"use client"

import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Bookmark } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setMobileDropdownOpen(false)
    setMobileMenuOpen(false)
    toast.success("Logged out successfully")
    navigate("/signin")
  }

  const handleProfileClick = () => {
    navigate("/worker-profile")
    setDropdownOpen(false)
    setMobileDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  const handleDashboardClick = () => {
    navigate("/worker-dashboard")
    setDropdownOpen(false)
    setMobileDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  const handleBookingsClick = () => {
    navigate("/bookings")
    setDropdownOpen(false)
    setMobileDropdownOpen(false)
    setMobileMenuOpen(false)
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
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs sm:text-sm">SH</span>
          </div>
          <span className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors hidden sm:inline">
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

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {auth ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium text-foreground truncate max-w-xs">
                  {auth.fullName || (auth.role === "worker" ? "Worker" : "User")}
                </span>
                <ChevronDown size={18} className={`text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Desktop Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-sm font-semibold text-foreground break-words">{auth.fullName || "User"}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-1">{auth.role}</div>
                  </div>

                  {auth.role !== "worker" && (
                    <button
                      onClick={handleBookingsClick}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <Bookmark size={16} />
                      My Bookings
                    </button>
                  )}

                  {auth.role === "worker" && (
                    <>
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <User size={16} />
                        Profile
                      </button>

                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors flex items-center gap-2 border-t border-border mt-2"
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
        <button 
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden border-t border-border bg-card shadow-inner overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? "max-h-screen opacity-100 translate-y-0" 
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-2 flex flex-col max-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Mobile Navigation Links */}
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

            {/* Mobile User Section */}
            <div className="pt-2 border-t border-border">
              {auth ? (
                <>
                  {/* User Info Header */}
                  <div className="px-4 py-3 mb-2 bg-muted rounded-lg">
                    <div className="text-sm font-semibold text-foreground break-words">{auth.fullName || "User"}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-1">{auth.role}</div>
                  </div>

                  {/* Mobile Dropdown Toggle */}
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Options</span>
                    <ChevronDown size={18} className={`transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Mobile Options */}
                  <div className={`space-y-1 mt-2 pl-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileDropdownOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}>
                    {auth.role !== "worker" && (
                        <button
                          onClick={handleBookingsClick}
                          className="w-full text-left px-4 py-3 text-base text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                        >
                          <Bookmark size={18} />
                          My Bookings
                        </button>
                      )}

                      {auth.role === "worker" && (
                        <>
                          <button
                            onClick={handleProfileClick}
                            className="w-full text-left px-4 py-3 text-base text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                          >
                            <User size={18} />
                            Profile
                          </button>

                          <button
                            onClick={handleDashboardClick}
                            className="w-full text-left px-4 py-3 text-base text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                          >
                            <LayoutDashboard size={18} />
                            Dashboard
                          </button>
                        </>
                      )}
                    </div>

                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-base text-destructive hover:bg-muted rounded-lg transition-colors flex items-center gap-3 mt-2 border-t border-border pt-3"
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
                    className="block px-4 py-3 text-base text-primary hover:bg-muted rounded-lg transition-colors text-center font-medium"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base text-center bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium mt-2"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
      </div>

      {/* Close dropdown when clicking outside on desktop */}
      {dropdownOpen && (
        <div
          className="hidden md:block fixed inset-0 z-30"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  )
}