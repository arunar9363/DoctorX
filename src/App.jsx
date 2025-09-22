// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoginModal from "./components/common/LoginModal";
import Audience from "./components/sections/Audience";
import About from "./components/sections/About";
import DiseaseFront from "./components/features/DiseasesFront";
import DiseaseSearch from "./components/features/DiseaseSearch";
import IndividualDiseasesInfo from "./components/features/IndividualDiseaseInfo";
import InfermedicaTriageSymptomChecker from "./components/features/InfermedicaTriageSymptomChecker";

// Pages
import Home from "./pages/Home";
import ContactPage from "./pages/ContactUsPage";
import SymptomPage from "./pages/SymptomPage";
import RegisterPage from "./pages/RegisterPage";
import TermsOfService from "./pages/TermsOfService";

// Wrapper for login modal page
function LoginPageWrapper() {
  return <LoginModal show={true} onClose={() => { }} />;
}

// Layout wrapper
function Layout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/home";

  return (
    <div className="landing-page">
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  // Remove the unused getApiBaseUrl function entirely

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/symptoms" element={<SymptomPage />} />
          <Route path="/diseases-front" element={<DiseaseFront />} />
          <Route path="/diseases" element={<DiseaseSearch />} />
          <Route path="/diseases/:diseaseName" element={<IndividualDiseasesInfo />} />

          {/* Infermedica Symptom Checker */}
          <Route
            path="/symptom-checker"
            element={
              <InfermedicaTriageSymptomChecker
                apiBaseUrl="/api"  // Use relative URL for Vercel
                authHeaders={{}}
                language="en" />
            }
          />

          <Route path="/audience" element={<Audience />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;