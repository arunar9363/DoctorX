import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import loginImage from "/assets/ragisterpage.svg";
import "../styles/RegisterPage.css";
import LoginModal from "../components/common/LoginModal";

// Simple Toast Component (inline to avoid import issues)
const SimpleToast = ({ message, type, show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  const toastStyles = {
    position: 'fixed',
    top: '80px',
    right: '20px',
    zIndex: 9999,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    opacity: isVisible ? 1 : 0,
    background: type === 'success'
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : type === 'error'
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : type === 'warning'
          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
          : 'linear-gradient(135deg, #3b82f6, #2563eb)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '16px 20px',
    minWidth: '320px',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    color: 'white',
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '✓';
    }
  };

  return (
    <div style={toastStyles}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1, fontWeight: '600', fontSize: '14px' }}>
        {message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        ×
      </button>
    </div>
  );
};

function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // Show toast function
  const showToast = (message, type = 'success') => {
    console.log("Showing toast:", message, type);
    setToast({ show: true, message, type });
  };

  // Hide toast function
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!name.trim()) {
      showToast("Please enter your full name.", "error");
      return false;
    }

    if (name.trim().length < 2) {
      showToast("Name must be at least 2 characters long.", "error");
      return false;
    }

    if (!gender) {
      showToast("Please select your gender.", "error");
      return false;
    }

    if (!bloodGroup) {
      showToast("Please select your blood group.", "error");
      return false;
    }

    if (!email.trim()) {
      showToast("Please enter your email address.", "error");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }

    if (!password) {
      showToast("Please enter a password.", "error");
      return false;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return false;
    }

    if (!confirmPassword) {
      showToast("Please confirm your password.", "error");
      return false;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match! Please check and try again.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to register user...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful:", userCredential.user);

      // Clear form
      setName("");
      setGender("");
      setBloodGroup("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      showToast("Registration successful! Welcome to DoctorX!", "success");

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Registration failed. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please use a different email or login.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage = "Registration is currently disabled. Please contact support.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Section - Illustration */}
      <div className="register-left">
        <h1>Welcome to DoctorX</h1>
        <p>Your trusted healthcare partner at your fingertips.</p>
        <img src={loginImage} alt="DoctorX Illustration" />
      </div>

      {/* Right Section - Form */}
      <div className="register-right">
        <div className="form-box">
          <h2>Create Account</h2>
          <p className="subtitle">
            Start managing your healthcare with <b>DoctorX</b>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <input
              type="password"
              placeholder="Create Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength="6"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Continue →"}
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <button
              className="btn-login"
              onClick={() => setShowLogin(true)}
              type="button"
              disabled={isLoading}
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <SimpleToast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
    </div>
  );
}

export default RegisterPage;