import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import HomePage from "./pages/HomePage"
import ServicesPage from "./pages/ServicesPage"
import ServiceListingPage from "./pages/ServiceListingPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import WorkerProfilePage from "./pages/WorkerProfilePage"
import WorkerDetailPage from "./pages/WorkerDetailPage"
import BookingsPage from "./pages/BookingsPage"
import WorkerDashboard from "./pages/WorkerDashboard"
import OTPVerificationPage from "./pages/OTPVerificationPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ContactUsPage from "./pages/ContactUsPage"
import AboutUsPage from "./pages/AboutUsPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="/services/:serviceType"
          element={
            <ProtectedRoute>
              <ServiceListingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route
          path="/worker-profile"
          element={
            <ProtectedRoute requiredRole="worker">
              <WorkerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/worker/:id" element={<WorkerDetailPage />} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="/worker-dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerDashboard /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
