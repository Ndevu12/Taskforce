import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import LearnMore from '../pages/LearnMore';
import NotAllowed from './NotAllowed';
// import NotFound from './NotFound';
import PublicLayout from '../layouts/PublicLayout';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '..//pages/PrivacyPolicy';
import DashboardLayout from '../pages/Dashboard/DashboardLayout';
import Overview from '../pages/Dashboard/Overview';

function Router() {
  return (
    <BrowserRouter>
      {/* PRIVATE ROUTES */}
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          {/* <Route path="profile" element={<Profile />} /> */}
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
        </Route>
      </Routes>

      {/* NOT ALLOWED AND NOT FOUND */}
      <Routes>
        <Route path="/not-allowed" element={<NotAllowed />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
