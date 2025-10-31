import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import LoginModal from "../common/LoginModal";

function Hero() {
  const [showLogin, setShowLogin] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);
  const navigate = useNavigate();

  const words = [
    "Health Hub",
    "Wellness Zone",
    "Digital Command",
    "Personal Dashboard"
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Word rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(darkMode);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Page loader timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Inject keyframe animations
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.id = 'hero-page-animations-styles';
    styleTag.innerHTML = `
      @keyframes fadeInText {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeInImage {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes wordSlideIn {
        0% { opacity: 0; transform: translateY(20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
      @keyframes heroLoaderRotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      [data-theme="dark"] .symptoms {
        background: linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%) !important;
      }
      
      [data-theme="light"] .symptoms {
        background: linear-gradient(135deg, var(--color-fourth) 0%, #f8fdfe 50%, var(--color-primary) 100%) !important;
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      const existingStyle = document.getElementById('hero-page-animations-styles');
      if (existingStyle && document.head.contains(existingStyle)) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  const isAuthenticated = user !== null;

  const handleStartChecking = () => {
    if (loading) return;
    if (isAuthenticated) {
      navigate('/symptoms');
    } else {
      setRedirectPath('/symptoms');
      setShowLogin(true);
    }
  };

  const handleExploreDiseases = () => {
    if (loading) return;
    if (isAuthenticated) {
      navigate('/diseases-front');
    } else {
      setRedirectPath('/diseases-front');
      setShowLogin(true);
    }
  };

  const handleAIAssistance = () => {
    if (loading) return;
    if (isAuthenticated) {
      navigate('/doctorx-ai');
    } else {
      setRedirectPath('/doctorx-ai');
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (redirectPath) {
      setTimeout(() => {
        navigate(redirectPath);
        setRedirectPath("");
      }, 100);
    }
  };

  // Page loader styles with unique IDs
  const heroPageLoaderOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: isDarkMode ? '#000' : '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const heroLoaderStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'inline-block',
    borderTop: '4px solid var(--color-secondary)',
    borderRight: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '4px solid transparent',
    boxSizing: 'border-box',
    animation: 'heroLoaderRotation 1s linear infinite',
    position: 'relative'
  };

  const heroLoaderAfterStyle = {
    content: "''",
    boxSizing: 'border-box',
    position: 'absolute',
    left: '0',
    top: '0',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    borderLeft: '4px solid var(--color-third)',
    borderBottom: '4px solid transparent',
    borderTop: '4px solid transparent',
    borderRight: '4px solid transparent',
    animation: 'heroLoaderRotation 0.5s linear infinite reverse'
  };

  const heroLoaderTextStyle = {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: 'var(--color-secondary)',
    fontWeight: '600',
    fontFamily: "'Merriweather', serif"
  };

  // Main component styles
  const heroStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    background: isDarkMode
      ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
      : 'linear-gradient(135deg, var(--color-fourth) 0%, #f8fdfe 50%, var(--color-primary) 100%)',
    transition: 'background 0.4s ease-in-out',
    paddingTop: isMobile ? '80px' : '0',
    paddingBottom: isMobile ? '40px' : '0'
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'stretch',
    flexDirection: isMobile || isTablet ? 'column' : 'row',
    gap: isMobile ? '30px' : isTablet ? '40px' : 0,
    width: '100%',
    maxWidth: '100%',
    margin: 0,
    padding: isMobile ? '0 20px' : isTablet ? '0 40px' : 0
  };

  const heroTextStyle = {
    flex: 1,
    maxWidth: isMobile || isTablet ? '100%' : '50%',
    padding: isMobile ? '20px 0' : isTablet ? '40px' : '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isMobile ? 'flex-start' : 'center',
    animation: 'fadeInText 0.8s ease-in-out forwards',
    textAlign: isMobile || isTablet ? 'center' : 'left'
  };

  const h5Style = {
    fontSize: isMobile ? '1.3rem' : isTablet ? '1.4rem' : '1.5rem',
    marginBottom: '10px',
    color: 'var(--color-secondary)',
    fontWeight: '600',
    fontFamily: "'Merriweather', serif"
  };

  const h1Style = {
    fontSize: isMobile ? '2.2rem' : isTablet ? '2.6rem' : '3rem',
    fontWeight: '700',
    marginBottom: '20px',
    fontFamily: "'Merriweather', serif",
    color: 'var(--color-dark)',
    lineHeight: '1.3'
  };

  const textAnimatedContainerStyle = {
    display: 'inline-block',
    height: isMobile ? 'auto' : isTablet ? '3.2rem' : '3.9rem',
    minHeight: isMobile ? '2.5rem' : isTablet ? '3.2rem' : '3.9rem',
    position: 'relative',
    width: '100%',
    overflow: 'hidden'
  };

  const animatedWordStyle = {
    height: isMobile ? 'auto' : isTablet ? '3.2rem' : '3.9rem',
    lineHeight: isMobile ? '1.2' : isTablet ? '3.2rem' : '3.9rem',
    fontSize: isMobile ? '2rem' : isTablet ? '2.4rem' : '3rem',
    fontWeight: '700',
    whiteSpace: isMobile ? 'normal' : 'nowrap',
    color: 'var(--color-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile || isTablet ? 'center' : 'flex-start',
    fontFamily: "'Merriweather', serif",
    animation: 'wordSlideIn 2s ease-in-out',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    textAlign: isMobile || isTablet ? 'center' : 'left'
  };

  const pStyle = {
    fontSize: isMobile ? '1rem' : isTablet ? '1.05rem' : '1.1rem',
    marginBottom: '30px',
    color: 'var(--color-dark)',
    lineHeight: '1.6',
    opacity: 0.9,
    maxWidth: '100%'
  };

  const ulStyle = {
    listStyle: 'none',
    marginBottom: isMobile ? '40px' : '50px',
    padding: 0,
    marginLeft: 0,
    textAlign: isMobile || isTablet ? 'left' : 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile || isTablet ? 'center' : 'flex-start'
  };

  const liStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: isMobile ? '1rem' : '1.05rem',
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    lineHeight: 1.6,
    color: 'var(--color-dark)',
    width: isMobile || isTablet ? 'auto' : '100%',
    justifyContent: 'flex-start'
  };

  const liCheckmarkStyle = {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    marginRight: '1rem',
    fontWeight: 700,
    borderRadius: '50%',
    backgroundColor: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
    color: 'var(--color-secondary)',
    transition: 'transform 0.3s ease'
  };

  const btnGroupStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
    gap: isMobile ? '20px' : isTablet ? '25px' : '20px',
    justifyContent: isMobile || isTablet ? 'center' : 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const btnHeroStyle = {
    padding: isMobile ? '14px 28px' : isTablet ? '13px 26px' : '12px 24px',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '600',
    fontSize: isMobile ? '1rem' : '1.05rem',
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-primary)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: isDarkMode
      ? '0 4px 15px rgba(13, 157, 184, 0.3)'
      : '0 4px 15px rgba(13, 157, 184, 0.2)',
    minWidth: isMobile ? '200px' : '160px',
    width: isMobile || isTablet ? '100%' : 'auto',
    maxWidth: isMobile ? '280px' : isTablet ? '300px' : '200px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.3px'
  };

  const btnHeroHoverStyle = {
    ...btnHeroStyle,
    backgroundColor: 'var(--color-third)',
    transform: 'translateY(-2px)',
    boxShadow: isDarkMode
      ? '0 7px 20px rgba(96, 165, 250, 0.4)'
      : '0 7px 20px rgba(59, 130, 246, 0.3)'
  };

  const heroImageStyle = {
    flex: isMobile || isTablet ? 'none' : 0.5,
    maxWidth: isMobile || isTablet ? '100%' : '50%',
    width: '100%',
    height: isMobile ? '280px' : isTablet ? '320px' : 'auto',
    backgroundImage: 'url("src/assets/HeroImage.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeInImage 0.8s ease-in-out forwards',
    order: isMobile || isTablet ? -1 : 0,
    marginBottom: isMobile ? '20px' : isTablet ? '30px' : 0
  };

  // Show loader if page is loading
  if (pageLoading) {
    return (
      <div style={heroPageLoaderOverlayStyle} className="hero-page-loader-overlay">
        <div style={{ textAlign: 'center' }} className="hero-page-loader-container">
          <div style={heroLoaderStyle} className="hero-page-spinner">
            <div style={heroLoaderAfterStyle}></div>
          </div>
          <p style={heroLoaderTextStyle} className="hero-page-loader-text">Loading DoctorX...</p>
        </div>
      </div>
    );
  }

  return (
    <section style={heroStyle} className="symptoms">
      <div style={containerStyle}>
        <div style={heroTextStyle}>
          <h5 style={h5Style}>DoctorX</h5>

          <h1 style={h1Style}>
            Smart Healthcare at Your{" "}
            <span style={textAnimatedContainerStyle} aria-hidden="true">
              <span style={animatedWordStyle} key={currentWordIndex}>
                {words[currentWordIndex]}
              </span>
            </span>
          </h1>

          <p style={pStyle}>
            DoctorX simplifies healthcare by allowing you to check symptoms,
            access reliable disease insights, and explore treatments and precautions with ease.
          </p>

          <ul style={ulStyle}>
            <li style={liStyle}>
              <span style={liCheckmarkStyle}>✓</span>
              <span style={{ margin: 0 }}>Analyze your symptoms</span>
            </li>
            <li style={liStyle}>
              <span style={liCheckmarkStyle}>✓</span>
              <span style={{ margin: 0 }}>Understand your health</span>
            </li>
            <li style={liStyle}>
              <span style={liCheckmarkStyle}>✓</span>
              <span style={{ margin: 0 }}>Plan your next steps</span>
            </li>
            <li style={liStyle}>
              <span style={liCheckmarkStyle}>✓</span>
              <span style={{ margin: 0 }}>Get ready for your visit</span>
            </li>
          </ul>

          <div style={btnGroupStyle}>
            <button
              style={btnHeroStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, btnHeroHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, btnHeroStyle);
              }}
              onClick={handleStartChecking}
              disabled={loading}
            >
              {loading ? "Loading..." : "Analyze Symptoms"}
            </button>
            <button
              style={btnHeroStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, btnHeroHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, btnHeroStyle);
              }}
              onClick={handleExploreDiseases}
              disabled={loading}
            >
              {loading ? "Loading..." : "Explore Diseases"}
            </button>
            <button
              style={btnHeroStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, btnHeroHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, btnHeroStyle);
              }}
              onClick={handleAIAssistance}
              disabled={loading}
            >
              {loading ? "Loading..." : "AI Assistance"}
            </button>
          </div>
        </div>

        <div style={heroImageStyle}>
          <img
            src="/assets/HeroImage.svg"
            alt="Doctor Illustration"
            style={{
              maxWidth: '100%',
              height: 'auto',
              width: 'auto'
            }}
          />
        </div>
      </div>

      <LoginModal
        show={showLogin}
        onClose={() => {
          setShowLogin(false);
          setRedirectPath("");
        }}
        onLoginSuccess={handleLoginSuccess}
        redirectPath={redirectPath}
      />
    </section>
  );
}

export default Hero;