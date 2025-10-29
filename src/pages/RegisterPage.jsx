import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import loginImage from "/assets/ragisterpage.svg";
import LoginModal from "../components/common/LoginModal";

// Simple Toast Component
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

  const [dob, setDob] = useState("");
  const [existingConditions, setExistingConditions] = useState("");
  const [city, setCity] = useState("");

  // Detect dark mode and screen size
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    checkTheme();
    checkScreenSize();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    window.addEventListener('resize', checkScreenSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const validateForm = () => {
    if (!name.trim()) {
      showToast("Please enter your full name.", "error");
      return false;
    }

    if (name.trim().length < 2) {
      showToast("Name must be at least 2 characters long.", "error");
      return false;
    }

    if (!dob) {
      showToast("Please enter your Date of Birth.", "error");
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

    if (!city.trim()) {
      showToast("Please enter your city or location.", "error");
      return false;
    }

    if (!email.trim()) {
      showToast("Please enter your email address.", "error");
      return false;
    }

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        dob: dob,
        gender: gender,
        bloodGroup: bloodGroup,
        city: city,
        existingConditions: existingConditions.trim() || "None",
        createdAt: new Date(),
      });

      setName("");
      setGender("");
      setBloodGroup("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDob("");
      setCity("");
      setExistingConditions("");

      showToast("Registration successful! Welcome to DoctorX!", "success");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
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

  // Inline Styles
  const pageStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    width: '100%',
    fontFamily: '"Inter", sans-serif',
    background: isDark
      ? 'linear-gradient(135deg, #0a192f 0%, #0f172a 50%, #1a365d 100%)'
      : 'linear-gradient(135deg, #e0f2fe 0%, #f8fdfe 50%, #dbeafe 100%)',
    paddingTop: isMobile ? '70px' : '0',
  };

  const leftStyle = {
    flex: isMobile ? 'none' : 1,
    width: isMobile ? '100%' : 'auto',
    color: isDark ? '#e2e8f0' : '#0d9db8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? '20px' : (isTablet ? '30px' : '40px'),
    textAlign: 'center',
    minWidth: 0,
    minHeight: isMobile ? 'auto' : '100vh',
  };

  const leftH1Style = {
    fontSize: isMobile ? '24px' : 'clamp(24px, 4vw, 36px)',
    marginBottom: '12px',
    fontWeight: 600,
    lineHeight: 1.2,
    color: isDark ? '#f1f5f9' : '#0d9db8',
  };

  const leftPStyle = {
    color: isDark ? '#94a3b8' : '#2d3748',
    fontSize: isMobile ? '14px' : 'clamp(14px, 2.5vw, 18px)',
    marginBottom: '20px',
    opacity: 0.9,
    lineHeight: 1.6,
    maxWidth: '400px',
  };

  const imgStyle = {
    maxWidth: isMobile ? 'min(100%, 240px)' : (isTablet ? 'min(100%, 320px)' : 'min(100%, 400px)'),
    width: '100%',
    height: 'auto',
    marginTop: isMobile ? '10px' : '20px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
  };

  const rightStyle = {
    flex: isMobile ? 'none' : 1,
    width: isMobile ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '20px' : (isTablet ? '30px' : '40px'),
    minWidth: 0,
    minHeight: isMobile ? 'auto' : '100vh',
  };

  const formBoxStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : (isTablet ? '480px' : '520px'),
    margin: '0 auto',
  };

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '0' : '16px',
    marginBottom: '0',
  };

  const h2Style = {
    fontSize: isMobile ? '1.8rem' : 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 600,
    marginBottom: isMobile ? '15px' : '20px',
    color: isDark ? '#f1f5f9' : '#0d9db8',
    fontFamily: '"Merriweather", serif',
    lineHeight: 1.2,
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.9rem' : 'clamp(0.9rem, 2vw, 1.1rem)',
    color: isDark ? '#94a3b8' : '#2d3748',
    marginBottom: isMobile ? '20px' : '24px',
    lineHeight: 1.5,
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '16px' : '14px 16px',
    marginBottom: isMobile ? '18px' : '16px',
    border: `2px solid ${isDark ? '#334155' : '#e5e7eb'}`,
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '16px' : '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    background: isDark ? '#1e293b' : '#fff',
    fontFamily: 'inherit',
    color: isDark ? '#e2e8f0' : '#2d3748',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '60px',
  };

  const buttonStyle = {
    width: '100%',
    padding: isMobile ? '18px' : '16px',
    background: 'linear-gradient(135deg, #0d9db8, #0ea5c1)',
    color: 'white',
    border: 'none',
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '16px' : '16px',
    fontWeight: 600,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginTop: isMobile ? '20px' : '24px',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.5px',
    opacity: isLoading ? 0.6 : 1,
  };

  const loginLinkStyle = {
    textAlign: 'center',
    marginTop: isMobile ? '24px' : '20px',
    fontSize: isMobile ? '15px' : '15px',
    color: isDark ? '#94a3b8' : '#2d3748',
  };

  const btnLoginStyle = {
    background: 'none',
    border: 'none',
    color: '#0d9db8',
    fontWeight: 600,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    textDecoration: 'underline',
    fontSize: 'inherit',
    padding: 0,
    margin: 0,
    transition: 'color 0.3s ease',
    opacity: isLoading ? 0.6 : 1,
  };

  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <h1 style={leftH1Style}>Welcome to DoctorX</h1>
        <p style={leftPStyle}>Your trusted healthcare partner at your fingertips.</p>
        <img src={loginImage} alt="DoctorX Illustration" style={imgStyle} />
      </div>

      <div style={rightStyle}>
        <div style={formBoxStyle}>
          <h2 style={h2Style}>Create Account</h2>
          <p style={subtitleStyle}>
            Start managing your healthcare with <b>DoctorX</b>
          </p>

          <form onSubmit={handleSubmit}>
            <div style={formRowStyle}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
              />

              <div style={{ position: 'relative', marginBottom: isMobile ? '18px' : '0' }}>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    ...inputStyle,
                    marginBottom: 0,
                    colorScheme: isDark ? 'dark' : 'light',
                  }}
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                />
                {!dob && (
                  <label style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isDark ? '#94a3b8' : '#6b7280',
                    pointerEvents: 'none',
                    fontSize: isMobile ? '16px' : '15px',
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    padding: '0 4px',
                    zIndex: 1,
                  }}>
                    Date of Birth
                  </label>
                )}
              </div>
            </div>

            <div style={formRowStyle}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
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
                style={inputStyle}
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
            </div>

            <input
              type="text"
              placeholder="Where do you live? (e.g., Mumbai, Delhi)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={isLoading}
              style={inputStyle}
            />

            <textarea
              placeholder="Do you have any existing medical conditions? (optional)"
              value={existingConditions}
              onChange={(e) => setExistingConditions(e.target.value)}
              disabled={isLoading}
              rows="2"
              style={textareaStyle}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={inputStyle}
            />

            <div style={formRowStyle}>
              <input
                type="password"
                placeholder="Create Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength="6"
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={buttonStyle}
            >
              {isLoading ? "Creating Account..." : "Continue →"}
            </button>
          </form>

          <p style={loginLinkStyle}>
            Already have an account?{" "}
            <button
              onClick={() => setShowLogin(true)}
              type="button"
              disabled={isLoading}
              style={btnLoginStyle}
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onShowToast={showToast}
      />

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
