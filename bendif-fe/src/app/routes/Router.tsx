import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import LearnMore from '../pages/LearnMore';
import NotAllowed from './NotAllowed';
import PublicLayout from '../layouts/PublicLayout';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import DashboardLayout from '../layouts/DashboardLayout';
import Overview from '../pages/Dashboard/Overview';
import Accounts from '../pages/Dashboard/Accounts';
import Budgets from '../pages/Dashboard/Budgets';
import Transactions from '../pages/Dashboard/Transactions';
import Reports from '../pages/Dashboard/Reports';
import Settings from '../pages/Dashboard/Settings';
import Profile from '../pages/Dashboard/Profile';
import Notifications from '../pages/Dashboard/Notifications';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../context/AuthContext';
import TransactionSummary from '../pages/Dashboard/TransactionSummary';
import ResendVerification from '../pages/Auth/ResendVerification';
import VerifyEmail from '../pages/Auth/VerifyEmail';
import RequestPasswordReset from '../pages/Auth/RequestPasswordReset';
import ResetPassword from '../pages/Auth/ResetPassword';
import NotFound from '../pages/NotFound';
import ErrorPage from '../pages/ErrorPage';
import Feedback from '../pages/Dashboard/Feedback';
import PublicFeedback from '../components/PublicFeedback';

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* PRIVATE ROUTES */}
        <Routes>
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="transactions" element={<Transactions />} />
              <Route
                path="transaction-summary"
                element={<TransactionSummary />}
              />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              {/* The feedback route */}
              <Route path="feedback" element={<Feedback />} />
            </Route>
          </Route>
        </Routes>

        {/* PUBLIC ROUTES */}
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/resend-verification"
              element={<ResendVerification />}
            />
            <Route
              path="/request-password-reset"
              element={<RequestPasswordReset />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* The public feedback entry point */}
            <Route path="/feedback" element={<PublicFeedback />} />
          </Route>
        </Routes>

        {/* NOT ALLOWED, NOT FOUND, AND ERROR PAGES */}
        <Routes>
          <Route path="/not-allowed" element={<NotAllowed />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/error" element={<ErrorPage />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
