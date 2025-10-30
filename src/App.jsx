// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

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
import DoctorXAIPage from "./pages/DoctorXAIPage";


// Wrapper for login modal page
function LoginPageWrapper() {
  return <LoginModal show={true} onClose={() => { }} />;
}

// Protected Router Component
const ProtectedRouter = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Optionally return a loading spinner
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
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/symptoms" element={<SymptomPage />} />
          <Route path="/diseases-front" element={<DiseaseFront />} />
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
          <Route path="/doctorx-ai" element={<DoctorXAIPage />} />
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