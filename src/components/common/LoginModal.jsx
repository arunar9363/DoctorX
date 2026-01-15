import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function LoginModal({ show, onClose, message, onShowToast, onLoginSuccess, redirectPath }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const navigate = useNavigate();

  if (!show) return null;

  // Email/Password login - Auto-create user if doesn't exist
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login successful:", user);

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: "",
          email: user.email,
          dob: "",
          gender: "",
          bloodGroup: "",
          city: "",
          existingConditions: "",
          createdAt: new Date(),
        });
        console.log("New user document created in Firestore");
      }

      setEmail("");
      setPassword("");

      if (onShowToast) {
        onShowToast("Login successful! Welcome back.", "success");
      }

      if (onLoginSuccess && redirectPath) {
        onLoginSuccess();
      } else {
        onClose();
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }

    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Login failed. Please try again.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email. Please register first!";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      }

      if (onShowToast) {
        onShowToast(errorMessage, "error");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google login - Auto-create user if doesn't exist
  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          dob: "",
          gender: "",
          bloodGroup: "",
          city: "",
          existingConditions: "",
          createdAt: new Date(),
        });
        console.log("New Google user document created in Firestore");

        if (onShowToast) {
          onShowToast("Welcome! Please complete your profile.", "success");
        }
      } else {
        if (onShowToast) {
          onShowToast("Welcome back! Logged in with Google successfully.", "success");
        }
      }

      console.log("Google login successful:", user);

      if (onLoginSuccess && redirectPath) {
        onLoginSuccess();
      } else {
        onClose();
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }

    } catch (err) {
      console.error("Google login error:", err);
      let errorMessage = "Google login failed. Please try again.";

      if (err.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups and try again.";
      } else if (err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled. Please try again.";
        setIsLoading(false);
        return;
      }

      if (onShowToast) {
        onShowToast(errorMessage, "error");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(12px)',
        padding: '20px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={handleOverlayClick}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.97);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          /* Custom scrollbar styling */
          div::-webkit-scrollbar {
            width: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          
          div::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #0d9db8, #60a5fa);
            border-radius: 10px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #0891b2, #3b82f6);
          }
        `}
      </style>

      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
        padding: '48px 40px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        border: 'none',
        borderImage: 'linear-gradient(to bottom, #0d9db8, #60a5fa) 1'
      }}>


        <button
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: isCloseHovered ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            fontSize: '20px',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '400',
            transform: isCloseHovered ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
          onClick={onClose}
          disabled={isLoading}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <img
              src="/assets/MAINLOGO2.png"
              alt="DoctorXCare Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>Welcome back</h2>
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            marginBottom: '0',
            fontWeight: '400'
          }}>Sign in to continue to DoctorXCare</p>
        </div>

        {message && (
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1px solid #fbbf24',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            color: '#92400e',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center'
          }}>{message}</div>
        )}

        {redirectPath && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #93c5fd',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            color: '#1e40af',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            Please sign in to access {redirectPath === '/symptoms' ? 'Symptom Checker' : 'Disease Explorer'}
          </div>
        )}

        <form style={{ marginBottom: '24px' }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>Email address</label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: focusedField === 'email' ? '2px solid #0d9db8' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: '#ffffff',
                color: '#111827',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                outline: 'none',
                boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(13, 157, 184, 0.1)' : 'none'
              }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>Password</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: focusedField === 'password' ? '2px solid #0d9db8' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: '#ffffff',
                color: '#111827',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                outline: 'none',
                boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(13, 157, 184, 0.1)' : 'none'
              }}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #0d9db8 0%, #0891b2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isPrimaryHovered && !isLoading ? '0 8px 20px rgba(13, 157, 184, 0.4)' : '0 4px 12px rgba(13, 157, 184, 0.3)',
              letterSpacing: '-0.01em',
              opacity: isLoading ? 0.6 : 1,
              transform: isPrimaryHovered && !isLoading ? 'translateY(-2px)' : 'translateY(0)'
            }}
            disabled={isLoading}
            onMouseEnter={() => setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '28px 0',
          fontSize: '13px',
          color: '#9ca3af',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)'
          }}></div>
          <span style={{ padding: '0 16px' }}>or</span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)'
          }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '14px',
            background: isGoogleHovered && !isLoading ? '#f9fafb' : '#ffffff',
            border: isGoogleHovered && !isLoading ? '2px solid #d1d5db' : '2px solid #e5e7eb',
            borderRadius: '12px',
            color: '#374151',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: isGoogleHovered && !isLoading ? '0 4px 8px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
            transform: isGoogleHovered && !isLoading ? 'translateY(-1px)' : 'translateY(0)'
          }}
          disabled={isLoading}
          onMouseEnter={() => setIsGoogleHovered(true)}
          onMouseLeave={() => setIsGoogleHovered(false)}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: '20px', height: '20px' }}
          />
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span style={{ color: '#f59e0b', fontWeight: '500' }}>New to DoctorXCare?</span>
          </p>
          <Link
            to="/register"
            style={{
              color: '#0d9db8',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onClick={onClose}
          >
            Create an account
          </Link>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
            <a
              href="/forgot-password"
              style={{
                color: '#0d9db8',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;