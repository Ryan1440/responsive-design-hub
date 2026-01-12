import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Clients from "./pages/dashboard/Clients";
import Vendors from "./pages/dashboard/Vendors";
import Timeline from "./pages/dashboard/Timeline";
import Finance from "./pages/dashboard/Finance";
import Reports from "./pages/dashboard/Reports";
import NotFound from "./pages/NotFound";
import ClientOverview from "./pages/dashboard/client/ClientOverview";
import ClientTimeline from "./pages/dashboard/client/ClientTimeline";
import ClientPayments from "./pages/dashboard/client/ClientPayments";
import ClientVendors from "./pages/dashboard/client/ClientVendors";
import ContactWO from "./pages/dashboard/ContactWO";
import VendorOverview from "./pages/dashboard/vendor/VendorOverview";
import RoleBasedOverview from "./pages/dashboard/RoleBasedOverview";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentPending from "./pages/PaymentPending";
import PaymentFailed from "./pages/PaymentFailed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<RoleBasedOverview />} />
              {/* Admin Routes */}
              <Route path="clients" element={<Clients />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="finance" element={<Finance />} />
              <Route path="reports" element={<Reports />} />
              {/* Client Routes */}
              <Route path="my-timeline" element={<ClientTimeline />} />
              <Route path="my-payments" element={<ClientPayments />} />
              <Route path="my-vendors" element={<ClientVendors />} />
              <Route path="contact" element={<ContactWO />} />
              {/* Vendor Routes */}
              <Route path="events" element={<VendorOverview />} />
              <Route path="tasks" element={<VendorOverview />} />
            </Route>
            {/* Payment Result Pages */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/pending" element={<PaymentPending />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
