import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoginModal from "../common/LoginModal";
import ProfilePage from "../../pages/ProfilePage";
import { auth, signOut } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

// --- ADDED: SVG Profile Icon Component ---
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);


// Simple Toast Component (Your existing code)
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
      : 'linear-gradient(135deg, #ef4444, #dc2626)',
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
        {type === 'success' ? '✓' : '✗'}
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

// Emergency Modal Component (Your existing code)
const EmergencyModal = ({ show, onClose, isDark }) => {
  if (!show) return null;

  const emergencyServices = {
    medical: [
      { name: "National Medical Emergency", number: "102", description: "24/7 Ambulance Service" },
      { name: "AIIMS Emergency", number: "011-26593677", description: "AIIMS Hospital Emergency" },
      { name: "Blood Bank", number: "104", description: "Blood Requirement & Availability" },
      { name: "COVID-19 Helpline", number: "1075", description: "COVID-19 Support & Information" }
    ],
    safety: [
      { name: "Police Emergency", number: "100", description: "Immediate Police Assistance" },
      { name: "Women Helpline", number: "1091", description: "Women in Distress" },
      { name: "Child Helpline", number: "1098", description: "CHILDLINE India Foundation" },
      { name: "Anti-Poison", number: "1066", description: "Poison Emergency" },
      { name: "Senior Citizen Helpline", number: "14567", description: "Elder Support Services" }
    ],
    disaster: [
      { name: "Fire Emergency", number: "101", description: "Fire Brigade Services" },
      { name: "Disaster Management", number: "108", description: "Natural Disaster Response" },
      { name: "Railway Emergency", number: "139", description: "Railway Accident & Security" },
      { name: "Road Accident Emergency", number: "1073", description: "Road Accident Assistance" },
      { name: "LPG Leak Helpline", number: "1906", description: "Gas Leak Emergency" }
    ],
    support: [
      { name: "Mental Health Helpline", number: "9152987821", description: "iCALL - Psychological Support" },
      { name: "Suicide Prevention", number: "9152987821", description: "24/7 Crisis Support" },
      { name: "Drug De-addiction", number: "1800-11-0031", description: "Drug Abuse Support" },
      { name: "AIDS Helpline", number: "1097", description: "HIV/AIDS Support & Info" },
      { name: "Tourist Helpline", number: "1363", description: "Tourist Assistance" }
    ]
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    modal: {
      background: isDark
        ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
        : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
      borderRadius: '20px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '85vh',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
      padding: '20px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    content: {
      padding: '30px',
      overflowY: 'auto',
      maxHeight: 'calc(85vh - 120px)'
    }
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={{ color: 'white', margin: 0 }}>🆘 Emergency Services</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '40px',
              height: '40px'
            }}
          >
            ×
          </button>
        </div>
        <div style={modalStyles.content}>
          {Object.entries(emergencyServices).map(([category, services]) => (
            <div key={category} style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: isDark ? '#fff' : '#1f2937',
                textTransform: 'capitalize',
                marginBottom: '15px'
              }}>
                {category} Services
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {services.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => handleCall(service.number)}
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#fff' : '#1f2937',
                      marginBottom: '5px'
                    }}>
                      {service.name}
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#dc2626',
                      marginBottom: '5px'
                    }}>
                      📞 {service.number}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280'
                    }}>
                      {service.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [showEmergency, setShowEmergency] = useState(false);

  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: '', type: 'success' });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Logout successful! See you again soon.", "success");
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Error logging out. Please try again.", "error");
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    closeMenu();
  };

  const styles = {
    navbar: {
      background: isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1030,
      padding: isMobile ? '0.5rem 0' : '0.75rem 0',
      boxShadow: isDark ? '0 2px 20px rgba(0, 0, 0, 0.3)' : '0 2px 20px rgba(0, 0, 0, 0.1)',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      width: '100%'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      flexShrink: 0
    },
    logo: {
      height: isMobile ? '30px' : '40px',
      width: 'auto'
    },
    desktopNav: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      margin: '0 2rem'
    },
    navLinks: {
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      alignItems: 'center',
      gap: '0.5rem'
    },
    navLink: {
      color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#333',
      fontWeight: '500',
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    },
    activeNavLink: {
      color: isDark ? '#4dabf7' : '#007bff',
      background: isDark ? 'rgba(77, 171, 247, 0.15)' : 'rgba(0, 123, 255, 0.15)'
    },
    desktopActions: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexShrink: 0
    },
    unifiedButton: {
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      whiteSpace: 'nowrap',
      border: 'none',
      textDecoration: 'none'
    },
    loginButton: {
      background: 'linear-gradient(135deg, #007bff, #0056b3)',
      color: 'white',
    },
    registerButton: {
      background: 'linear-gradient(135deg, #28a745, #1e7e34)',
      color: 'white',
    },
    logoutButton: {
      background: 'linear-gradient(135deg, #dc3545, #c82333)',
      color: 'white',
    },
    profileButton: {
      background: 'linear-gradient(135deg, #17a2b8, #117a8b)',
      color: 'white'
    },
    emergencyBtn: {
      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
      color: 'white',
    },
    themeToggle: {
      width: '50px',
      height: '26px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '13px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    toggleTrack: {
      width: '100%',
      height: '100%',
      background: isDark ? '#374151' : '#e5e7eb',
      borderRadius: '13px',
      position: 'relative',
      transition: 'all 0.3s ease',
      padding: '2px'
    },
    toggleThumb: {
      width: '22px',
      height: '22px',
      background: isDark ? '#f3f4f6' : 'white',
      borderRadius: '50%',
      position: 'absolute',
      left: '2px',
      top: '2px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transform: isDark ? 'translateX(24px)' : 'translateX(0)',
      zIndex: 2
    },
    toggleIcons: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '0 5px',
      position: 'relative',
      zIndex: 1
    },
    mobileToggler: {
      display: isMobile ? 'flex' : 'none',
      background: 'transparent',
      border: 'none',
      padding: '0.5rem',
      cursor: 'pointer',
      fontSize: '24px',
      color: isDark ? 'white' : 'black'
    },
    mobileMenu: {
      position: 'fixed',
      top: '62px',
      left: 0,
      right: 0,
      width: '100vw',
      height: 'auto',
      maxHeight: 'calc(100vh - 62px)',
      background: isDark ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(15px)',
      border: 'none',
      zIndex: 1000,
      display: isMenuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: 0
    },
    mobileNavLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      margin: 0,
      listStyle: 'none',
      padding: '10px 0',
      borderRadius: '0',
    },
    mobileNavLink: {
      color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#2d3748',
      fontWeight: '500',
      fontSize: '1rem',
      padding: '0.7rem 1.5rem',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    mobileActions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      background: isDark ? '#1a202c' : '#f7fafc',
    },
    mobileButton: {
      padding: '0.7rem 1.5rem',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.85rem',
      cursor: 'pointer',
      textDecoration: 'none',
      border: 'none',
      width: '100%',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    mobileLoginButton: {
      background: 'linear-gradient(135deg, #007bff, #0056b3)',
      color: 'white',
    },
    mobileRegisterButton: {
      background: 'linear-gradient(135deg, #28a745, #1e7e34)',
      color: 'white',
    },
    mobileLogoutButton: {
      background: 'linear-gradient(135deg, #dc3545, #c82333)',
      color: 'white',
    },
    mobileProfileButton: {
      background: 'linear-gradient(135deg, #17a2b8, #117a8b)',
      color: 'white'
    },
    mobileEmergencyBtn: {
      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
      color: 'white',
    },
    mobileThemeContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '0.5rem'
    }
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          <Link style={styles.brand} to="/" onClick={closeMenu}>
            <img style={styles.logo} src="/assets/MAINLOGO1.png" alt="DoctorX Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div style={styles.desktopNav}>
            <ul style={styles.navLinks}>
              <li><Link style={{ ...styles.navLink, ...(isActiveLink('/') ? styles.activeNavLink : {}) }} to="/">Home</Link></li>
              {user && (
                <>
                  <li><Link style={{ ...styles.navLink, ...(isActiveLink('/symptoms') ? styles.activeNavLink : {}) }} to="/symptoms">Analyze Symptoms</Link></li>
                  <li><Link style={{ ...styles.navLink, ...(isActiveLink('/diseases-front') ? styles.activeNavLink : {}) }} to="/diseases-front">Disease Details</Link></li>
                </>
              )}
              <li><Link style={{ ...styles.navLink, ...(isActiveLink('/audience') ? styles.activeNavLink : {}) }} to="/audience">Audience</Link></li>
              <li><Link style={{ ...styles.navLink, ...(isActiveLink('/about') ? styles.activeNavLink : {}) }} to="/about">About Us</Link></li>
              <li><Link style={{ ...styles.navLink, ...(isActiveLink('/terms') ? styles.activeNavLink : {}) }} to="/terms">Terms & Conditions</Link></li>
              <li><Link style={{ ...styles.navLink, ...(isActiveLink('/contact') ? styles.activeNavLink : {}) }} to="/contact">Feedback</Link></li>
            </ul>
          </div>

          {/* Desktop Actions */}
          <div style={styles.desktopActions}>
            {!isLoading && (
              !user ? (
                <>
                  <button style={{ ...styles.unifiedButton, ...styles.loginButton }} onClick={() => setShowLogin(true)}>Login</button>
                  <Link style={{ ...styles.unifiedButton, ...styles.registerButton }} to="/register">Register</Link>
                </>
              ) : (
                <>
                  <button onClick={handleProfileClick} style={{ ...styles.unifiedButton, ...styles.profileButton }}>
                    <ProfileIcon /> My Profile
                  </button>
                  <button style={{ ...styles.unifiedButton, ...styles.logoutButton }} onClick={handleLogout}>Logout</button>
                </>
              )
            )}
            <button style={{ ...styles.unifiedButton, ...styles.emergencyBtn }} onClick={() => setShowEmergency(true)}>SOS</button>
            <button style={styles.themeToggle} onClick={toggleTheme}>
              <span style={styles.toggleTrack}>
                <span style={styles.toggleThumb}></span>
                <span style={styles.toggleIcons}>
                  <span style={{ fontSize: '12px', opacity: isDark ? 0.3 : 1 }}>☀️</span>
                  <span style={{ fontSize: '12px', opacity: isDark ? 1 : 0.3 }}>🌙</span>
                </span>
              </span>
            </button>
          </div>

          {/* Mobile Toggler */}
          <button onClick={toggleMenu} style={styles.mobileToggler}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div style={styles.mobileMenu}>
          <ul style={styles.mobileNavLinks}>
            <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/') ? styles.activeNavLink : {}) }} to="/" onClick={closeMenu}>Home</Link></li>
            {user && (
              <>
                <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/symptoms') ? styles.activeNavLink : {}) }} to="/symptoms" onClick={closeMenu}>Analyze Symptoms</Link></li>
                <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/diseases-front') ? styles.activeNavLink : {}) }} to="/diseases-front" onClick={closeMenu}>Disease Details</Link></li>
              </>
            )}
            <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/audience') ? styles.activeNavLink : {}) }} to="/audience" onClick={closeMenu}>Audience</Link></li>
            <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/about') ? styles.activeNavLink : {}) }} to="/about" onClick={closeMenu}>About Us</Link></li>
            <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/terms') ? styles.activeNavLink : {}) }} to="/terms" onClick={closeMenu}>Terms & Conditions</Link></li>
            <li><Link style={{ ...styles.mobileNavLink, ...(isActiveLink('/contact') ? styles.activeNavLink : {}) }} to="/contact" onClick={closeMenu}>Feedback</Link></li>
          </ul>

          <div style={styles.mobileActions}>
            {!isLoading && (
              !user ? (
                <>
                  <button style={{ ...styles.mobileButton, ...styles.mobileLoginButton }} onClick={() => { setShowLogin(true); closeMenu(); }}>Login</button>
                  <Link style={{ ...styles.mobileButton, ...styles.mobileRegisterButton }} to="/register" onClick={closeMenu}>Register</Link>
                </>
              ) : (
                <>
                  <button style={{ ...styles.mobileButton, ...styles.mobileProfileButton }} onClick={handleProfileClick}>
                    <ProfileIcon /> My Profile
                  </button>
                  <button style={{ ...styles.mobileButton, ...styles.mobileLogoutButton }} onClick={handleLogout}>Logout</button>
                </>
              )
            )}
            <button style={{ ...styles.mobileButton, ...styles.mobileEmergencyBtn }} onClick={() => { setShowEmergency(true); closeMenu(); }}>🆘 Emergency Help</button>
            <div style={styles.mobileThemeContainer}>
              <button style={styles.themeToggle} onClick={toggleTheme}>
                <span style={styles.toggleTrack}>
                  <span style={styles.toggleThumb}></span>
                  <span style={styles.toggleIcons}>
                    <span style={{ fontSize: '12px', opacity: isDark ? 0.3 : 1 }}>☀️</span>
                    <span style={{ fontSize: '12px', opacity: isDark ? 1 : 0.3 }}>🌙</span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <>
        <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onShowToast={showToast} />
        <ProfilePage show={showProfile} onClose={() => setShowProfile(false)} onShowToast={showToast} />
        <EmergencyModal show={showEmergency} onClose={() => setShowEmergency(false)} isDark={isDark} />
        <SimpleToast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        `}</style>
      </>
    </>
  );
}

export default Navbar;