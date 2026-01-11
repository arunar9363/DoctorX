// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getAssessmentHistory, getSavedDiseases } from "../services/firebaseService";
import profileImage from "/assets/profile.jpg"; // Default profile image

// Helper function to format date
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const [, setUser] = useState(null);
  const [userName, setUserName] = useState("Doctor");
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [savedDiseases, setSavedDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle Resize for Mobile View
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check theme
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Fetch User & Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 1. Fetch User Profile Name
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().name) {
            setUserName(userDoc.data().name);
          } else if (currentUser.displayName) {
            setUserName(currentUser.displayName);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }

        // 2. Fetch Recent Assessments (Limit 2)
        try {
          const assessments = await getAssessmentHistory();
          setRecentAssessments(assessments.slice(0, 2));
        } catch (e) {
          console.error("Error fetching assessments:", e);
        }

        // 3. Fetch Saved Diseases (Limit 2)
        try {
          const diseases = await getSavedDiseases();
          setSavedDiseases(diseases.slice(0, 2));
        } catch (e) {
          console.error("Error fetching diseases:", e);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- STYLES ---
  const styles = {
    container: {
      paddingTop: "100px", // Navbar space
      paddingBottom: "40px",
      paddingLeft: "20px",
      paddingRight: "20px",
      minHeight: "100vh",
      background: isDarkMode
        ? "linear-gradient(135deg, #1f2937 0%, #0f172a 50%, #121212 100%)"
        : "linear-gradient(135deg, #f0f9ff 0%, #f8fdfe 50%, #ffffff 100%)",
      fontFamily: "'Inter', sans-serif"
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    // Welcome Section
    welcomeSection: {
      display: "flex",
      // Mobile: column-reverse puts the image (2nd child) on top of text (1st child)
      flexDirection: isMobile ? "column-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: isMobile ? "center" : "left",
      marginBottom: "40px",
      background: isDarkMode ? "rgba(31, 41, 55, 0.6)" : "rgba(255, 255, 255, 0.8)",
      padding: "30px",
      borderRadius: "20px",
      backdropFilter: "blur(10px)",
      border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(13, 157, 184, 0.1)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },
    welcomeText: {
      flex: 1
    },
    h1: {
      fontSize: isMobile ? "1.8rem" : "2rem",
      fontWeight: "700",
      color: isDarkMode ? "#e5e7eb" : "#0d9db8",
      marginBottom: "8px",
      fontFamily: "'Merriweather', serif"
    },
    p: {
      color: isDarkMode ? "#9ca3af" : "#64748b",
      fontSize: "1.1rem"
    },
    profileImage: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #0d9db8",
      padding: "3px",
      marginLeft: isMobile ? "0" : "20px",
      marginBottom: isMobile ? "15px" : "0"
    },
    // Services Grid
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "25px",
      marginBottom: "40px"
    },
    serviceCard: {
      background: isDarkMode ? "rgba(31, 41, 55, 0.8)" : "white",
      padding: "30px 25px 0 25px", // Removed bottom padding so image sits at bottom
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      border: isDarkMode ? "1px solid #374151" : "1px solid #e2e8f0",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start", // Align text to left
      justifyContent: "space-between",
      height: "100%", // Full height
      minHeight: "320px", // Ensure consistent height
      position: "relative",
      overflow: "hidden"
    },
    // Text container to keep text at top
    textContainer: {
      width: '100%',
      zIndex: 2
    },
    cardTitle: {
      fontSize: "1.35rem",
      fontWeight: "700",
      marginBottom: "10px",
      color: isDarkMode ? "#e5e7eb" : "#1e293b",
      fontFamily: "'Merriweather', serif"
    },
    cardDesc: {
      fontSize: "0.95rem",
      color: isDarkMode ? "#9ca3af" : "#64748b",
      lineHeight: "1.5",
      marginBottom: "20px"
    },
    arrowLink: {
      color: "#0d9db8",
      fontWeight: "700",
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      marginBottom: "20px"
    },
    // Large Image Styles
    cardLargeImage: {
      width: "100%",
      maxWidth: "180px", // Limit max width
      height: "auto",
      maxHeight: "160px",
      alignSelf: "center", // Center horizontally
      marginTop: "auto", // Push to bottom
      filter: isDarkMode ? "brightness(0.9)" : "none",
      transition: "transform 0.3s ease"
    },
    // Bottom Section (Split View)
    bottomSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
    },
    sectionBox: {
      background: isDarkMode ? "rgba(31, 41, 55, 0.6)" : "white",
      borderRadius: "16px",
      padding: "25px",
      border: isDarkMode ? "1px solid #374151" : "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #f1f5f9",
      paddingBottom: "15px"
    },
    sectionTitle: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: isDarkMode ? "#e5e7eb" : "#0f172a"
    },
    viewAllLink: {
      color: "#0d9db8",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none"
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px",
      marginBottom: "10px",
      background: isDarkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
      borderRadius: "10px",
      border: isDarkMode ? "1px solid transparent" : "1px solid #e2e8f0"
    },
    itemTitle: {
      fontWeight: "600",
      color: isDarkMode ? "#e5e7eb" : "#334155",
      marginBottom: "4px"
    },
    itemSub: {
      fontSize: "0.85rem",
      color: isDarkMode ? "#9ca3af" : "#64748b"
    },
    badge: (color) => ({
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: `${color}20`,
      color: color,
      border: `1px solid ${color}40`
    }),
    emptyText: {
      textAlign: "center",
      color: "#94a3b8",
      padding: "20px",
      fontStyle: "italic"
    }
  };

  // Helper to get severity color
  const getSeverityColor = (level) => {
    if (['emergency', 'emergency_ambulance', 'critical'].includes(level)) return '#ef4444'; // Red
    if (['consultation_6', 'consultation_24', 'moderate'].includes(level)) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        {/* 1. Welcome Header */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeText}>
            <h1 style={styles.h1}>Welcome, {userName}</h1>
            <p style={styles.p}>Here's what's happening with your health today.</p>
          </div>
          <img
            src={profileImage}
            alt="Profile"
            style={styles.profileImage}
            onClick={() => navigate('/dashboard')}
          />
        </div>

        {/* 2. Services Grid */}
        <div style={styles.servicesGrid}>
          {/* Analyze Symptoms */}
          <div
            style={styles.serviceCard}
            onClick={() => navigate('/symptoms')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1)';
            }}
          >
            <div style={styles.textContainer}>
              <h3 style={styles.cardTitle}>Analyze Symptoms</h3>
              <p style={styles.cardDesc}>Check your symptoms using our advanced AI to get instant triage advice.</p>
              <div style={styles.arrowLink}>Start Check →</div>
            </div>
            <img
              src="/assets/Symptomspage.svg"
              alt="Symptoms"
              className="card-image"
              style={styles.cardLargeImage}
            />
          </div>

          {/* Explore Diseases */}
          <div
            style={styles.serviceCard}
            onClick={() => navigate('/diseases-front')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1)';
            }}
          >
            <div style={styles.textContainer}>
              <h3 style={styles.cardTitle}>Disease Library</h3>
              <p style={styles.cardDesc}>Search our verified medical library for detailed disease information.</p>
              <div style={styles.arrowLink}>Explore →</div>
            </div>
            <img
              src="/assets/diseas.svg"
              alt="Diseases"
              className="card-image"
              style={styles.cardLargeImage}
            />
          </div>

          {/* Lab Analysis - NEW SERVICE */}
          <div
            style={styles.serviceCard}
            onClick={() => navigate('/lab-analysis')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1)';
            }}
          >
            <div style={styles.textContainer}>
              <h3 style={styles.cardTitle}>Lab Report Analysis</h3>
              <p style={styles.cardDesc}>Upload lab reports or medical imaging for AI-powered analysis and insights.</p>
              <div style={styles.arrowLink}>Upload Now →</div>
            </div>
            <img
              src="/assets/lab-analysis.svg"
              alt="Lab Analysis"
              className="card-image"
              style={styles.cardLargeImage}
            />
          </div>

          {/* AI Assistance */}
          <div
            style={styles.serviceCard}
            onClick={() => navigate('/doctorx-ai')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1)';
            }}
          >
            <div style={styles.textContainer}>
              <h3 style={styles.cardTitle}>Free AI Assistant</h3>
              <p style={styles.cardDesc}>Chat with DoctorXCare for personalized health guidance 24/7.</p>
              <div style={styles.arrowLink}>Chat Now →</div>
            </div>
            <img
              src="/assets/hi.svg"
              alt="AI"
              className="card-image"
              style={styles.cardLargeImage}
            />
          </div>
        </div>

        {/* 3. Bottom Split Section */}
        <div style={styles.bottomSection}>

          {/* Left: Recent Assessments */}
          <div style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Recent Assessments</div>
              <div style={styles.viewAllLink} onClick={() => navigate('/history')}>View All →</div>
            </div>

            {recentAssessments.length > 0 ? (
              recentAssessments.map(item => (
                <div key={item.id} style={styles.listItem}>
                  <div>
                    <div style={styles.itemTitle}>{item.patientName || 'Self Assessment'}</div>
                    <div style={styles.itemSub}>{formatDate(item.completedAt)} • {item.symptoms?.length || 0} Symptoms</div>
                  </div>
                  <span style={styles.badge(getSeverityColor(item.triageLevel))}>
                    {item.triageLevel === 'no_action' ? 'Stable' : 'Check Required'}
                  </span>
                </div>
              ))
            ) : (
              <div style={styles.emptyText}>No recent assessments found.</div>
            )}
          </div>

          {/* Right: Saved Diseases */}
          <div style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Saved Diseases</div>
              <div style={styles.viewAllLink} onClick={() => navigate('/history')}>View All →</div>
            </div>

            {savedDiseases.length > 0 ? (
              savedDiseases.map(item => (
                <div key={item.id} style={{ ...styles.listItem, cursor: 'pointer' }} onClick={() => navigate(`/diseases/${item.diseaseSlug}`)}>
                  <div>
                    <div style={styles.itemTitle}>{item.diseaseName}</div>
                    <div style={styles.itemSub}>{item.category || 'Medical Condition'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#0d9db8', fontSize: '1.2rem' }}>›</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyText}>No saved diseases yet.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;