// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // Make sure firebase is exported from here

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
import ProfilePage from "./pages/ProfilePage"; // Import the new profile page

// Wrapper for login modal page
function LoginPageWrapper() {
  return <LoginModal show={true} onClose={() => { }} />;
}

// Protected Router Component
// This will protect routes that require a user to be logged in.
const ProtectedRouter = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // You can optionally return a loading spinner here
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};


// Layout wrapper
function Layout({ children }) {
  const location = useLocation();
  // Let's adjust this to hide on the root path instead of /home
  const hideLayout = location.pathname === "/";

  return (
    <div className="landing-page">
      {/* Conditionally render Navbar and Footer */}
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* The Layout component now wraps everything and controls Navbar/Footer visibility */}
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
          <Route path="/audience" element={<Audience />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRouter />}>
            <Route path="/profile" element={<ProfilePage />} />
            {/* You can add more protected routes here in the future */}
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
