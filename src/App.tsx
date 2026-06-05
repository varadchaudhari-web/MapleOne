import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ForgotPasswordPage from "./pages/ForgotPassword";
import FeaturesPage from "./pages/Features";
import SolutionsPage from "./pages/Solutions";
import PricingPage from "./pages/Pricing";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProfilePage from "./pages/Profile";
import {
  ChangelogPage,
  RoadmapPage,
  DocsPage,
  ApiReferencePage,
  TutorialsPage,
  BlogPage,
  CommunityForumPage,
  CareersPage,
  PressKitPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  CookiePolicyPage,
} from "./pages/FooterPages";

// Resident Dashboard
import ResidentDashboard from "./pages/dashboard/ResidentDashboard";
import ResidentVisitors from "./pages/dashboard/ResidentVisitors";
import ResidentBills from "./pages/dashboard/ResidentBills";
import ResidentRequests from "./pages/dashboard/ResidentRequests";
import ResidentFacilities from "./pages/dashboard/ResidentFacilities";
import ResidentCommunity from "./pages/dashboard/ResidentCommunity";

// Other Dashboards
import CommitteeDashboard from "./pages/dashboard/CommitteeDashboard";
import CommitteeManagement from "./pages/dashboard/CommitteeManagement";
import SecurityDashboard from "./pages/dashboard/SecurityDashboard";
import MaintenanceDashboard from "./pages/dashboard/MaintenanceDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import BuilderDashboard from "./pages/dashboard/BuilderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Footer Pages */}
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/api-reference" element={<ApiReferencePage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/community" element={<CommunityForumPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press-kit" element={<PressKitPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          {/* Resident Dashboard */}
          <Route path="/dashboard/resident" element={<ResidentDashboard />} />
          <Route path="/dashboard/resident/visitors" element={<ResidentVisitors />} />
          <Route path="/dashboard/resident/bills" element={<ResidentBills />} />
          <Route path="/dashboard/resident/requests" element={<ResidentRequests />} />
          <Route path="/dashboard/resident/facilities" element={<ResidentFacilities />} />
          <Route path="/dashboard/resident/community" element={<ResidentCommunity />} />
          <Route path="/dashboard/resident/family" element={<ResidentDashboard />} />
          <Route path="/dashboard/resident/marketplace" element={<ResidentDashboard />} />
          <Route path="/dashboard/resident/sos" element={<ResidentDashboard />} />
          <Route path="/dashboard/resident/profile" element={<ResidentDashboard />} />

          {/* Committee Dashboard */}
          <Route path="/dashboard/committee" element={<CommitteeDashboard />} />
          <Route path="/dashboard/committee/residents" element={<CommitteeManagement />} />
          <Route path="/dashboard/committee/complaints" element={<CommitteeManagement />} />
          <Route path="/dashboard/committee/announcements" element={<CommitteeManagement />} />
          <Route path="/dashboard/committee/financials" element={<CommitteeDashboard />} />
          <Route path="/dashboard/committee/maintenance" element={<CommitteeDashboard />} />
          <Route path="/dashboard/committee/engagement" element={<CommitteeManagement />} />
          <Route path="/dashboard/committee/reports" element={<CommitteeDashboard />} />
          <Route path="/dashboard/committee/settings" element={<CommitteeDashboard />} />

          {/* Security Dashboard */}
          <Route path="/dashboard/security" element={<SecurityDashboard />} />
          <Route path="/dashboard/security/visitors" element={<SecurityDashboard />} />
          <Route path="/dashboard/security/qr" element={<SecurityDashboard />} />
          <Route path="/dashboard/security/vehicles" element={<SecurityDashboard />} />
          <Route path="/dashboard/security/deliveries" element={<SecurityDashboard />} />
          <Route path="/dashboard/security/incidents" element={<SecurityDashboard />} />
          <Route path="/dashboard/security/history" element={<SecurityDashboard />} />

          {/* Maintenance Dashboard */}
          <Route path="/dashboard/maintenance" element={<MaintenanceDashboard />} />
          <Route path="/dashboard/maintenance/tickets" element={<MaintenanceDashboard />} />
          <Route path="/dashboard/maintenance/workorders" element={<MaintenanceDashboard />} />
          <Route path="/dashboard/maintenance/vendors" element={<MaintenanceDashboard />} />
          <Route path="/dashboard/maintenance/tracking" element={<MaintenanceDashboard />} />
          <Route path="/dashboard/maintenance/completed" element={<MaintenanceDashboard />} />

          {/* Vendor Dashboard */}
          <Route path="/dashboard/vendor" element={<VendorDashboard />} />
          <Route path="/dashboard/vendor/catalog" element={<VendorDashboard />} />
          <Route path="/dashboard/vendor/requests" element={<VendorDashboard />} />
          <Route path="/dashboard/vendor/bookings" element={<VendorDashboard />} />
          <Route path="/dashboard/vendor/ratings" element={<VendorDashboard />} />
          <Route path="/dashboard/vendor/earnings" element={<VendorDashboard />} />

          {/* Builder Dashboard */}
          <Route path="/dashboard/builder" element={<BuilderDashboard />} />
          <Route path="/dashboard/builder/properties" element={<BuilderDashboard />} />
          <Route path="/dashboard/builder/towers" element={<BuilderDashboard />} />
          <Route path="/dashboard/builder/occupancy" element={<BuilderDashboard />} />
          <Route path="/dashboard/builder/health" element={<BuilderDashboard />} />
          <Route path="/dashboard/builder/reports" element={<BuilderDashboard />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/communities" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/permissions" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/analytics" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/logs" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/subscriptions" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/monitor" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/settings" element={<AdminDashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
