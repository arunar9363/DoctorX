import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

// Helper hook for responsive design using media queries in JS
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

function SymptomChecker() {
  const navigate = useNavigate(); // Add this line
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Responsive breakpoints
  const isMediumScreen = useMediaQuery('(max-width: 992px)');
  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  useEffect(() => {
    // Check for dark theme
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark');
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Simulate page loading - copied timing from Hero.jsx
    const loadingTimer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 2500); // Updated to match Hero.jsx timing

    return () => {
      observer.disconnect();
      clearTimeout(loadingTimer);
    };
  }, []);

  // Inject keyframe animations into the document head - copied from Hero.jsx
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');
      
      @keyframes fadeInText {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeInImage {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes wordSlideIn {
        0% { opacity: 0; transform: translateY(20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
      @keyframes rotation {
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
      if (document.head.contains(styleTag)) {
        document.head.removeChild(styleTag);
      }
    };
  }, []);

  // Define color palettes for themes
  const themes = {
    light: {
      colorPrimary: '#ffffff',
      colorSecondary: '#0d9db8',
      colorThird: '#3b82f6',
      colorFourth: '#d1f4f9',
      colorDark: '#1a1a1a',
      btnTextColor: '#ffffff',
    },
    dark: {
      colorPrimary: '#121212',
      colorSecondary: '#0d9db8',
      colorThird: '#60a5fa',
      colorFourth: '#1f2937',
      colorDark: '#e5e7eb',
      btnTextColor: '#fff',
    }
  };
  const currentTheme = themes[isDarkTheme ? 'dark' : 'light'];

  // Helper function to merge styles conditionally
  const mergeStyles = (...styleObjects) => Object.assign({}, ...styleObjects.filter(Boolean));

  // Define styles after state variables are declared
  const styles = {
    symptomCheckerWrapper: {
      width: '100%',
      overflowX: 'hidden',
      minHeight: '100vh',
    },

    fullPageLoader: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: isDarkTheme ? '#000' : '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },

    loaderContainer: {
      textAlign: 'center',
    },

    loader: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'inline-block',
      borderTop: '4px solid var(--color-secondary)',
      borderRight: '4px solid transparent',
      borderBottom: '4px solid transparent',
      borderLeft: '4px solid transparent',
      boxSizing: 'border-box',
      animation: 'rotation 1s linear infinite',
      position: 'relative',
    },

    loaderAfter: {
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
      animation: 'rotation 0.5s linear infinite reverse',
    },

    loadingText: {
      marginTop: '20px',
      fontSize: '1.2rem',
      color: 'var(--color-secondary)',
      fontWeight: '600',
      fontFamily: "'Merriweather', serif",
    },

    symptomsContainer: mergeStyles(
      {
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3rem',
        padding: '4rem 5%',
        background: isDarkTheme
          ? 'linear-gradient(135deg, #1f2937 0%, #0f172a 50%, #121212 100%)'
          : 'linear-gradient(120deg, #ffffff 0%, #d1f4f9 100%)',
        transition: 'all 0.6s ease',
        opacity: isPageLoaded ? 1 : 0,
        transform: isPageLoaded ? 'translateY(0)' : 'translateY(20px)',
      },
      isMediumScreen && {
        flexDirection: 'column',
        textAlign: 'center',
        padding: '3rem 5%',
        minHeight: 'auto',
        gap: '2rem',
      },
      isSmallScreen && {
        padding: '2rem 3%',
        gap: '1.5rem',
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '40px',
      }
    ),

    symImage: mergeStyles(
      {
        flex: 1,
        maxWidth: '45%',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isPageLoaded ? 'fadeInImage 0.8s ease-in-out forwards' : 'none',
        padding: '20px 0',
      },
      isMediumScreen && {
        order: -1,
        maxWidth: '100%',
        minHeight: 'auto',
        marginBottom: '1rem',
        padding: '15px 0',
      },
      isSmallScreen && {
        minHeight: 'auto',
        maxWidth: '100%',
        padding: '10px 0',
        alignSelf: 'stretch',
      }
    ),

    image: mergeStyles(
      {
        width: '100%',
        height: 'auto',
        maxHeight: '500px',
        objectFit: 'contain',
        objectPosition: 'center center',
        filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))',
      },
      isMediumScreen && {
        maxHeight: '400px',
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
      },
      isSmallScreen && {
        maxHeight: 'none',
        height: 'auto',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto',
        display: 'block',
      }
    ),

    symText: mergeStyles(
      {
        flex: 1,
        maxWidth: '55%',
        color: currentTheme.colorDark,
        animation: isPageLoaded ? 'fadeInText 0.8s ease-in-out forwards' : 'none',
      },
      isMediumScreen && {
        maxWidth: '100%',
        order: 2,
      }
    ),

    h2: mergeStyles(
      {
        fontFamily: "'Merriweather', serif",
        fontSize: 'clamp(2rem, 5vw, 2.8rem)',
        fontWeight: 700,
        color: isDarkTheme ? '#0d9db8' : currentTheme.colorSecondary,
        lineHeight: 1.3,
        marginBottom: '1.5rem',
        animation: isPageLoaded ? 'slideUp 0.6s ease 0.2s both' : 'none',
      },
      isSmallScreen && {
        fontSize: '1.8rem',
        marginBottom: '1rem',
      }
    ),

    p: mergeStyles(
      {
        fontFamily: "'Inter', sans-serif",
        fontSize: '1.1rem',
        lineHeight: 1.7,
        maxWidth: '600px',
        opacity: 0.9,
        marginBottom: '2rem',
        color: isDarkTheme ? '#e5e7eb' : currentTheme.colorDark,
        animation: isPageLoaded ? 'slideUp 0.6s ease 0.3s both' : 'none',
      },
      isMediumScreen && {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      isSmallScreen && {
        fontSize: '1rem',
        marginBottom: '1.5rem',
      }
    ),

    h3: mergeStyles(
      {
        fontFamily: "'Merriweather', serif",
        fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
        color: isDarkTheme ? '#60a5fa' : currentTheme.colorThird,
        marginTop: '2rem',
        marginBottom: '1rem',
        animation: isPageLoaded ? 'slideUp 0.6s ease 0.4s both' : 'none',
      },
      isSmallScreen && {
        fontSize: '1.3rem',
        marginTop: '1.5rem',
      }
    ),

    ul: mergeStyles(
      {
        listStyle: 'none',
        paddingLeft: 0,
        marginTop: '1.5rem',
        marginBottom: '2.5rem',
      },
      isMediumScreen && {
        textAlign: 'left',
        display: 'inline-block',
      },
      isSmallScreen && {
        marginTop: '1rem',
        marginBottom: '2rem',
      }
    ),

    li: mergeStyles(
      {
        fontFamily: "'Inter', sans-serif",
        fontSize: '1.05rem',
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        lineHeight: 1.6,
        color: isDarkTheme ? '#e5e7eb' : currentTheme.colorDark,
      },
      isSmallScreen && {
        fontSize: '0.95rem',
        marginBottom: '0.8rem',
      }
    ),

    liCheckmark: {
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      marginRight: '1rem',
      fontWeight: 700,
      borderRadius: '50%',
      backgroundColor: isDarkTheme ? 'rgba(13, 157, 184, 0.2)' : currentTheme.colorFourth,
      color: isDarkTheme ? '#0d9db8' : currentTheme.colorSecondary,
      transition: 'transform 0.3s ease',
      fontSize: '12px',
    },

    btnHero: mergeStyles(
      {
        display: 'inline-block',
        fontFamily: "'Inter', sans-serif",
        fontSize: '1.1rem',
        fontWeight: 600,
        padding: '1rem 2.5rem',
        borderRadius: '50px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isDarkTheme ? '#0d9db8' : currentTheme.colorSecondary,
        color: currentTheme.btnTextColor,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: isDarkTheme
          ? '0 4px 15px rgba(13, 157, 184, 0.3)'
          : '0 4px 15px rgba(13, 157, 184, 0.2)',
        transition: 'all 0.3s ease',
        animation: isPageLoaded ? 'slideUp 0.6s ease 0.7s both' : 'none',
      },
      isButtonHovered && !isAnalyzing && {
        backgroundColor: isDarkTheme ? '#60a5fa' : currentTheme.colorThird,
        transform: 'translateY(-3px)',
        boxShadow: isDarkTheme
          ? '0 7px 20px rgba(96, 165, 250, 0.4)'
          : '0 7px 20px rgba(59, 130, 246, 0.3)',
      },
      isAnalyzing && {
        backgroundColor: isDarkTheme ? 'rgba(13, 157, 184, 0.7)' : 'rgba(13, 157, 184, 0.7)',
        cursor: 'not-allowed',
        transform: 'translateY(0)',
      },
      isSmallScreen && {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
      }
    ),

    buttonLoader: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      display: 'inline-block',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      animation: 'rotation 1s linear infinite',
      marginRight: '10px',
      verticalAlign: 'middle',
    },
  };

  // FIXED: Updated handleStartAnalysis function to use correct navigation
  const handleStartAnalysis = () => {
    setIsAnalyzing(true);

    // Simulate navigation loading time
    setTimeout(() => {
      // Navigate to the correct route defined in App.jsx
      navigate('/symptom-checker');
      setIsAnalyzing(false);
    }, 1500); // Reduced timeout for better UX
  };

  // Show full page loader when page is initially loading - copied from Hero.jsx
  if (!isPageLoaded) {
    return (
      <div style={styles.fullPageLoader}>
        <div style={styles.loaderContainer}>
          <div style={styles.loader}>
            <div style={styles.loaderAfter}></div>
          </div>
          <p style={styles.loadingText}>Loading DoctorX...</p>
        </div>
      </div>
    );
  }

  const listItems = [
    "Possible causes of your symptoms",
    "Recommendations on next steps",
    "Guidance on when to seek professional care"
  ];

  return (
    <section style={styles.symptomCheckerWrapper} className="symptoms">
      <div style={styles.symptomsContainer}>
        <div style={styles.symImage}>
          <img
            src="/assets/Symptomspage.svg"
            alt="Doctors Illustration"
            style={styles.image}
          />
        </div>
        <div style={styles.symText}>
          <h2 style={styles.h2}>
            Start your analysis now and take the first step towards smarter healthcare:
          </h2>
          <p style={styles.p}>
            Take a quick AI-powered symptom assessment designed to guide you with clarity and care. Your information remains completely private and secure, because your trust matters most to us.
          </p>
          <h3 style={styles.h3}>Your results will include:</h3>
          <ul style={styles.ul}>
            {listItems.map((item, index) => (
              <li
                key={index}
                style={{
                  ...styles.li,
                  animation: isPageLoaded ? `slideUp 0.6s ease ${0.5 + index * 0.1}s both` : 'none',
                }}
              >
                <span
                  style={{
                    ...styles.liCheckmark,
                    animation: isPageLoaded ? `slideUp 0.4s ease ${0.6 + index * 0.1}s both` : 'none',
                  }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button
            style={styles.btnHero}
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {isAnalyzing ? (
              <>
                <span style={styles.buttonLoader}></span>
                Initializing...
              </>
            ) : (
              'Start Symptom Analysis'
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default SymptomChecker;