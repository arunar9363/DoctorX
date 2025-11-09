import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkTheme();
    checkScreenSize();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    window.addEventListener('resize', checkScreenSize);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    const mode = urlParams.get('mode');

    if (code && mode === 'resetPassword') {
      setOobCode(code);
      setStep(3);

      verifyPasswordResetCode(auth, code)
        .then((email) => {
          setEmail(email);
          setMessage({
            text: "âœ“ Code verified! Please enter your new password.",
            type: "success"
          });
        })
        .catch(() => {
          setMessage({
            text: "âœ— Invalid or expired reset code. Please request a new one.",
            type: "error"
          });
          setStep(1);
        });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Check if email exists in Firestore users collection
  const checkEmailExists = async (emailToCheck) => {
    try {
      const normalizedEmail = emailToCheck.toLowerCase().trim();
      console.log("Checking email:", normalizedEmail);

      const usersRef = collection(db, "users");

      // Try exact match first
      const exactQuery = query(usersRef, where("email", "==", normalizedEmail));
      const exactSnapshot = await getDocs(exactQuery);

      if (!exactSnapshot.empty) {
        console.log("Email found in Firestore (exact match)");
        return true;
      }

      // Also try case-insensitive search by getting all users and checking
      const allUsersQuery = query(usersRef);
      const allUsersSnapshot = await getDocs(allUsersQuery);

      let found = false;
      allUsersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email && userData.email.toLowerCase() === normalizedEmail) {
          found = true;
          console.log("Email found in Firestore (manual search)");
        }
      });

      if (!found) {
        console.log("Email NOT found in Firestore");
      }

      return found;
    } catch (error) {
      console.error("Error checking email in Firestore:", error);
      // In case of error, try to send reset email anyway
      // Firebase Auth will handle if email doesn't exist
      return true;
    }
  };

  // Step 1: Validate and check email
  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        text: "âœ— Please enter a valid email address.",
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    // Check if email is registered in Firestore
    const emailExists = await checkEmailExists(email);

    if (!emailExists) {
      setMessage({
        text: "âœ— This email is not registered. Please sign up first!",
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    // Email is registered, move to verification step
    setStep(2);
    setIsLoading(false);
  };

  // Step 2: Confirm email and send reset link
  const handleConfirmAndSendEmail = async () => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Send reset email directly - Firebase will handle validation
      await sendPasswordResetEmail(auth, email);

      setMessage({
        text: "âœ“ Password reset email sent! Please check your inbox and spam folder. Click the link in the email to proceed.",
        type: "success"
      });

      setTimeout(() => {
        setStep(1);
        setEmail("");
        setMessage({ text: "", type: "" });
      }, 5000);

    } catch (err) {
      console.error("Password reset error:", err);
      let errorMessage = "Failed to send reset email. Please try again.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "âœ— No account found with this email address. Please sign up first!";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "âœ— Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "âœ— Too many requests. Please try again later.";
      }

      setMessage({
        text: errorMessage,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({
        text: "âœ— Passwords do not match!",
        type: "error"
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        text: "âœ— Password must be at least 6 characters long.",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);

      setMessage({
        text: "âœ“ Password reset successful! Redirecting to login...",
        type: "success"
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Password reset error:", err);
      let errorMessage = "Failed to reset password. Please try again.";

      if (err.code === "auth/expired-action-code") {
        errorMessage = "âœ— Reset code has expired. Please request a new reset email.";
      } else if (err.code === "auth/invalid-action-code") {
        errorMessage = "âœ— Invalid reset code. Please request a new reset email.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "âœ— Password is too weak. Please use a stronger password.";
      }

      setMessage({
        text: errorMessage,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // CSS Variables
  const colorPrimary = isDark ? '#121212' : '#ffffff';
  const colorSecondary = '#0d9db8';
  const colorThird = isDark ? '#60a5fa' : '#3b82f6';
  const colorFourth = isDark ? '#1f2937' : '#d1f4f9';
  const colorDark = isDark ? '#e5e7eb' : '#1a1a1a';

  const pageStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    width: '100%',
    fontFamily: '"Inter", sans-serif',
    background: isDark
      ? `linear-gradient(135deg, ${colorFourth} 0%, #0f172a 50%, #1a365d 100%)`
      : `linear-gradient(135deg, ${colorFourth} 0%, #f0f9fc 50%, #e0f2fe 100%)`,
    paddingTop: isMobile ? '70px' : '0',
  };

  const leftStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? '20px' : '40px',
    textAlign: 'center',
  };

  const leftH1Style = {
    fontSize: isMobile ? '24px' : 'clamp(24px, 4vw, 36px)',
    marginBottom: '12px',
    fontWeight: 600,
    lineHeight: 1.2,
    color: colorSecondary,
  };

  const leftPStyle = {
    color: colorDark,
    fontSize: isMobile ? '14px' : 'clamp(14px, 2.5vw, 18px)',
    marginBottom: '30px',
    opacity: 0.85,
    lineHeight: 1.6,
    maxWidth: '400px',
  };

  const svgContainerStyle = {
    marginTop: '20px',
    maxWidth: isMobile ? '300px' : '450px',
    width: '100%',
  };

  const rightStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '20px' : '40px',
  };

  const formBoxStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '520px',
    margin: '0 auto',
  };

  const h2Style = {
    fontSize: isMobile ? '1.8rem' : 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 600,
    marginBottom: isMobile ? '15px' : '20px',
    color: colorSecondary,
    fontFamily: '"Merriweather", serif',
    lineHeight: 1.2,
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.9rem' : 'clamp(0.9rem, 2vw, 1.1rem)',
    color: colorDark,
    marginBottom: isMobile ? '20px' : '24px',
    lineHeight: 1.5,
    opacity: 0.85,
  };

  const alertStyle = {
    padding: isMobile ? '14px 16px' : '16px 18px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    textAlign: 'left',
    animation: 'slideDown 0.3s ease-out',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const alertSuccess = {
    ...alertStyle,
    background: isDark
      ? 'linear-gradient(135deg, rgba(13, 157, 184, 0.2), rgba(96, 165, 250, 0.15))'
      : 'linear-gradient(135deg, rgba(13, 157, 184, 0.1), rgba(59, 130, 246, 0.1))',
    color: colorSecondary,
    borderLeft: `4px solid ${colorSecondary}`,
  };

  const alertError = {
    ...alertStyle,
    background: isDark
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))'
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
    color: isDark ? '#fca5a5' : '#dc2626',
    borderLeft: `4px solid ${isDark ? '#fca5a5' : '#dc2626'}`,
  };

  const alertInfo = {
    ...alertStyle,
    background: isDark
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.15))'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.1))',
    color: colorThird,
    borderLeft: `4px solid ${colorThird}`,
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '16px' : '14px 16px',
    marginBottom: isMobile ? '18px' : '16px',
    border: `2px solid ${isDark ? colorFourth : '#e5e7eb'}`,
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '16px' : '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    background: colorPrimary,
    fontFamily: 'inherit',
    color: colorDark,
  };

  const buttonStyle = {
    width: '100%',
    padding: isMobile ? '18px' : '16px',
    background: `linear-gradient(135deg, ${colorSecondary}, ${colorThird})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '16px' : '16px',
    fontWeight: 600,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginTop: isMobile ? '8px' : '12px',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.5px',
    opacity: isLoading ? 0.6 : 1,
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: isDark ? '#334155' : '#e5e7eb',
    color: colorDark,
  };

  const backLinkStyle = {
    textAlign: 'center',
    marginTop: isMobile ? '24px' : '20px',
    fontSize: isMobile ? '15px' : '15px',
    color: colorDark,
    opacity: 0.85,
  };

  const btnBackStyle = {
    background: 'none',
    border: 'none',
    color: colorSecondary,
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
        <h1 style={leftH1Style}>Recover Your Access</h1>
        <p style={leftPStyle}>
          We're here to help! Follow the simple steps to reset your password and regain access to your DoctorXCare account.
        </p>
        <div style={svgContainerStyle}>
          <img
            src="/assets/Forgot password.svg"
            alt="Forgot Password"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div style={rightStyle}>
        <div style={formBoxStyle}>
          {/* Step 1: Email Entry */}
          {step === 1 && (
            <>
              <h2 style={h2Style}>Reset Password</h2>
              <p style={subtitleStyle}>
                Enter your email address and we'll verify it before sending a reset link
              </p>

              {message.text && (
                <div style={message.type === 'success' ? alertSuccess : alertError}>
                  <span style={{ fontSize: '18px' }}>
                    {message.type === 'success' ? 'âœ“' : 'âœ•'}
                  </span>
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSendResetEmail}>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = colorSecondary;
                    e.target.style.boxShadow = isDark
                      ? `0 0 0 3px rgba(13, 157, 184, 0.1)`
                      : `0 0 0 3px rgba(13, 157, 184, 0.15)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? colorFourth : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 20px rgba(13, 157, 184, 0.3)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isLoading ? "Checking..." : "Continue â†’"}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <>
              <h2 style={h2Style}>Confirm Email</h2>
              <p style={subtitleStyle}>
                Please confirm this is the correct email address
              </p>

              {message.text && (
                <div style={message.type === 'success' ? alertSuccess : alertError}>
                  <span style={{ fontSize: '18px' }}>
                    {message.type === 'success' ? 'âœ“' : 'âœ•'}
                  </span>
                  <span>{message.text}</span>
                </div>
              )}

              {/* Email Display */}
              <div style={alertInfo}>
                <span style={{ fontSize: '18px' }}>âœ‰ï¸</span>
                <div>
                  <strong>Email:</strong> {email}
                </div>
              </div>

              <p style={{ ...subtitleStyle, marginBottom: '24px', fontSize: '14px' }}>
                A password reset link will be sent to this email. You'll have 24 hours to reset your password.
              </p>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmAndSendEmail}
                disabled={isLoading}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 20px rgba(13, 157, 184, 0.3)`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {isLoading ? "Sending..." : "Yes, Send Reset Link â†’"}
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => {
                  setStep(1);
                  setMessage({ text: "", type: "" });
                }}
                disabled={isLoading}
                style={{ ...secondaryButtonStyle, marginTop: '12px' }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                }}
              >
                â† Change Email
              </button>
            </>
          )}

          {/* Step 3: Password Reset */}
          {step === 3 && (
            <>
              <h2 style={h2Style}>Create New Password</h2>
              <p style={subtitleStyle}>
                Set a strong new password for your account
              </p>

              {message.text && (
                <div style={message.type === 'success' ? alertSuccess : alertError}>
                  <span style={{ fontSize: '18px' }}>
                    {message.type === 'success' ? 'âœ“' : 'âœ•'}
                  </span>
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength="6"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = colorSecondary;
                    e.target.style.boxShadow = isDark
                      ? `0 0 0 3px rgba(13, 157, 184, 0.1)`
                      : `0 0 0 3px rgba(13, 157, 184, 0.15)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? colorFourth : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength="6"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = colorSecondary;
                    e.target.style.boxShadow = isDark
                      ? `0 0 0 3px rgba(13, 157, 184, 0.1)`
                      : `0 0 0 3px rgba(13, 157, 184, 0.15)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? colorFourth : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 20px rgba(13, 157, 184, 0.3)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password â†’"}
                </button>
              </form>
            </>
          )}

          <p style={backLinkStyle}>
            <button
              onClick={() => navigate("/")}
              type="button"
              disabled={isLoading}
              style={btnBackStyle}
            >
              â† Back to Home
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;