// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Analytics } from '@vercel/analytics/react';

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoginModal from "./components/common/LoginModal";
import ScrollToTop from "./components/common/ScrollToTop";
import Audience from "./components/sections/Audience";
import About from "./components/sections/AboutUs";
import Services from "./components/features/services";
import DiseaseSearch from "./components/features/DiseaseSearch";
import IndividualDiseasesInfo from "./components/features/IndividualDiseaseInfo";
import InfermedicaTriageSymptomChecker from "./components/features/InfermedicaTriageSymptomChecker";
import LabUpload from "./components/features/ai-agents/LabAnalysis/LabUpload"; // Lab Analysis Component

// Pages
import Home from "./pages/Home";
import ContactPage from "./pages/ContactUsPage";
import SymptomPage from "./pages/SymptomPage";
import RegisterPage from "./pages/RegisterPage";
import TermsOfService from "./pages/TermsOfService";
import DoctorXAIPage from "./pages/DoctorXAIPage";
import HistoryPage from "./pages/HistoryPage";
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from "./pages/Dashboard";


// Wrapper for login modal page
function LoginPageWrapper() {
  return <LoginModal show={true} onClose={() => { }} />;
}

// Protected Router Component
const ProtectedRouter = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="landing-page">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          <Route path="/symptoms" element={<SymptomPage />} />
          
         
          {/* Other Public Routes */}
          <Route path="/audience" element={<Audience />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRouter />}>
            <Route path="/services" element={<Services />} />
            <Route path="/diseases" element={<DiseaseSearch />} />
            <Route path="/diseases/:diseaseName" element={<IndividualDiseasesInfo />} />
            <Route
              path="/symptom-checker"
              element={
                <InfermedicaTriageSymptomChecker
                  apiBaseUrl="/api"
                  authHeaders={{}}
                  language="en" />
              }
            />
            <Route path="/lab-analysis" element={<LabUpload />} />
            <Route path="/doctorx-ai" element={<DoctorXAIPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </Layout>
      <Analytics />
    </Router>
  );
}

export default App;