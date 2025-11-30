import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../../styles/LoginModal.css";

function LoginModal({ show, onClose, message, onShowToast, onLoginSuccess, redirectPath }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

      // Check if user document exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create user document with minimal info
        await setDoc(userDocRef, {
          uid: user.uid,
          name: "", // Empty name - will show "Edit Profile" in profile
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

      // Show success toast
      if (onShowToast) {
        onShowToast("Login successful! Welcome back.", "success");
      }

      // Handle redirect or call onLoginSuccess
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

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create user document with Google info
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || "", // Use Google display name or empty
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

      // Handle redirect or call onLoginSuccess
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content glass">
        <button
          className="btn btn-close"
          onClick={onClose}
          disabled={isLoading}
        >
          ✕
        </button>

        {message && (
          <div className="alert alert-warning text-center">{message}</div>
        )}

        <h2 className="modal-title">Login</h2>

        {redirectPath && (
          <div className="alert alert-info text-center">
            Please login to continue to {redirectPath === '/symptoms' ? 'Symptom Checker' : 'Disease Explorer'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="or-divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn-google w-100"
          disabled={isLoading}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="google-icon"
          />
          {isLoading ? "Logging in..." : "Login with Google"}
        </button>

        <div className="text-center mt-3">
          <p>
            <span id="acc">Don't have an account? then </span><br />
            <Link to="/register" className="register-link" onClick={onClose}>Register here</Link>
          </p>
          <p><a href="/forgot-password">Forgot password?</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;