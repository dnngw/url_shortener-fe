import { Routes, Route } from "react-router"
import GuestLayout from "@/components/layouts/GuestLayout"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import GuestRoute from "@/routes/GuestRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"
import LandingPage from "@/pages/public"
import NotFound from "@/pages/public/not-found"
import LinkUnavailable from "@/pages/public/link-unavailable"
import Login from "@/pages/auth/login"
import Register from "@/pages/auth/register"
import DashboardHome from "@/pages/dashboard/home"
import Links from "@/pages/dashboard/links"
import QrGenerator from "@/pages/dashboard/qr"
import AdminUsers from "@/pages/dashboard/admin/users"
import AdminLinks from "@/pages/dashboard/admin/links"

export default function AppRouter() {
  return (
   <Routes>
      {/*
      Public Route
      */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<LandingPage />} />
        {/* Backend redirects browsers here when a short link is not found / disabled */}
        <Route path="/link-unavailable" element={<LinkUnavailable />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/*
      Protected Route (every role)
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />

          {/*
          Role user only
          */}
          <Route element={<ProtectedRoute roles={['user']} />}>
            <Route path="/links" element={<Links />} />
            <Route path="/qr" element={<QrGenerator />} />
          </Route>

          {/*
          Role admin only
          */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/links" element={<AdminLinks />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
