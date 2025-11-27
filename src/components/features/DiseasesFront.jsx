import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

function DiseaseFront() {
  const navigate = useNavigate();

  // State for managing theme and hover effects
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(darkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const handleExploreDiseases = () => {
    navigate('/diseases'); // This matches your App.jsx route
  };

  // Inject keyframe animations into the document head
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes fadeInText {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeInImage {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // --- INLINE STYLES START ---

  // Define color palettes for themes based on CSS variables
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
  const currentTheme = themes[isDarkMode ? 'dark' : 'light'];

  // Responsive breakpoints
  const isMediumScreen = useMediaQuery('(max-width: 992px)');
  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  // Helper function to merge styles conditionally
  const mergeStyles = (...styleObjects) => Object.assign({}, ...styleObjects.filter(Boolean));

  const styles = {
    DiseaseFront: {
      width: '100%',
      overflowX: 'hidden',
    },
    diseaseInfo: mergeStyles(
      {
        display: 'flex',
        minHeight: '10vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3rem',
        padding: '4rem 5%',
        paddingTop: '6rem', // Added extra top padding to clear the navbar
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : `linear-gradient(120deg, ${currentTheme.colorPrimary} 0%, ${currentTheme.colorFourth} 100%)`,
        transition: 'background 0.4s ease-in-out',
      },
      isMediumScreen && {
        flexDirection: 'column',
        textAlign: 'center',
        padding: '3rem 5%',
        paddingTop: '5rem', // Adjusted for medium screens
        minHeight: 'auto',
        gap: '2rem',
      },
      isSmallScreen && {
        padding: '2rem 3%',
        paddingTop: '4rem', // Adjusted for small screens
        gap: '1.5rem',
      }
    ),
    diseaseText: mergeStyles(
      {
        flex: 1,
        maxWidth: '50%',
        color: currentTheme.colorDark,
        animation: 'fadeInText 0.8s ease-in-out forwards',
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
        color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary,
        lineHeight: 1.3,
        marginBottom: '1.5rem',
      },
      isSmallScreen && {
        fontSize: '1.8rem',
        marginBottom: '1rem',
      }
    ),
    h3: mergeStyles(
      {
        fontFamily: "'Merriweather', serif",
        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
        color: isDarkMode ? 'var(--color-third)' : currentTheme.colorThird,
        marginTop: '2.5rem',
        marginBottom: '1rem',
      },
      isSmallScreen && {
        fontSize: '1.3rem',
        marginTop: '2rem',
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
        color: isDarkMode ? 'var(--color-dark)' : currentTheme.colorDark,
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
        color: isDarkMode ? 'var(--color-dark)' : currentTheme.colorDark,
      },
      isSmallScreen && {
        fontSize: '0.95rem',
        marginBottom: '0.8rem',
      }
    ),
    // Replicating the ::before pseudo-element with a span
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
      backgroundColor: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : currentTheme.colorFourth,
      color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary,
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
        backgroundColor: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary,
        color: currentTheme.btnTextColor,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: isDarkMode
          ? '0 4px 15px rgba(13, 157, 184, 0.3)'
          : '0 4px 15px rgba(13, 157, 184, 0.2)',
        transition: 'all 0.3s ease',
      },
      isButtonHovered && {
        backgroundColor: isDarkMode ? 'var(--color-third)' : currentTheme.colorThird,
        transform: 'translateY(-3px)',
        boxShadow: isDarkMode
          ? '0 7px 20px rgba(96, 165, 250, 0.4)'
          : '0 7px 20px rgba(59, 130, 246, 0.3)',
      },
      isSmallScreen && {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
      }
    ),
    diseaseImage: mergeStyles(
      {
        flex: 1,
        maxWidth: '50%',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeInImage 0.8s ease-in-out forwards',
        padding: '20px 0',
      },
      isMediumScreen && {
        order: 1,
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
    img: mergeStyles(
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
        maxWidth: '280px',
        margin: '0 auto',
        display: 'block',
      }
    ),
  };

  // --- INLINE STYLES END ---

  return (
    <section style={styles.DiseaseFront}>
      <div style={styles.diseaseInfo}>
        <div style={styles.diseaseText}>
          <h2 style={styles.h2}>Global Health Intelligence & Verified Disease Data</h2>
          <p style={styles.p}>
            Stop searching through unreliable forums. Access our clinically vetted database to understand diseases, conditions, and treatments. We translate complex medical data into clear, actionable insights backed by global health standards.
          </p>
          <h3 style={styles.h3}>Inside every disease profile, you will find:</h3>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <span style={styles.liCheckmark}>✓</span>
              <strong>Clinical Overview:</strong> Clear, jargon-free medical summaries.
            </li>
            <li style={styles.li}>
              <span style={styles.liCheckmark}>✓</span>
              <strong>Symptom Identification:</strong> Early warning signs & red flags.
            </li>
            <li style={styles.li}>
              <span style={styles.liCheckmark}>✓</span>
              <strong>Proven Prevention:</strong> Lifestyle guides to stay protected.
            </li>
            <li style={styles.li}>
              <span style={styles.liCheckmark}>✓</span>
              <strong>Care Protocols:</strong> Standard treatments & recovery paths.
            </li>
            <li style={styles.li}>
              <span style={styles.liCheckmark}>✓</span>
              <strong>Live Updates:</strong> Real-time data from WHO & CDC.
            </li>
          </ul>
          <button
            style={styles.btnHero}
            onClick={handleExploreDiseases}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Explore Disease Database
          </button>
        </div>
        <div style={styles.diseaseImage}>
          <img style={styles.img} src="/assets/diseas.svg" alt="Medical Database Illustration" />
        </div>
      </div>
    </section>
  );
}

export default DiseaseFront;