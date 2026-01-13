import React from 'react';
import { useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Check theme
  React.useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const mediaQueryMobile = window.matchMedia('(max-width: 768px)');
  const mediaQuerySmall = window.matchMedia('(max-width: 480px)');

  const getResponsiveStyles = () => {
    if (mediaQuerySmall.matches) {
      return {
        section: {
          padding: '30px 10px',
          paddingTop: '70px'
        },
        h2: {
          fontSize: '1.4rem',
          marginBottom: '25px'
        },
        h2After: {
          width: '60px',
          height: '3px',
          margin: '15px auto 0'
        },
        serviceCard: {
          padding: '15px 12px',
          gap: '12px',
          borderRadius: '20px',
          minHeight: '280px'
        },
        cardTitle: {
          fontSize: '1.1rem',
          marginBottom: '8px'
        },
        cardDesc: {
          fontSize: '0.8rem',
          marginBottom: '10px',
          lineHeight: '1.4'
        },
        featureItem: {
          fontSize: '0.75rem',
          padding: '4px 0',
          gap: '6px'
        },
        featureIcon: {
          width: '16px',
          height: '16px',
          minWidth: '16px',
          fontSize: '0.8rem'
        },
        img: {
          maxWidth: '120px',
          maxHeight: '110px'
        },
        servicesGrid: {
          gap: '20px',
          marginTop: '30px'
        }
      };
    } else if (mediaQueryMobile.matches) {
      return {
        section: {
          padding: '40px 12px',
          paddingTop: '80px'
        },
        h2: {
          fontSize: '1.6rem',
          marginBottom: '35px'
        },
        h2After: {
          width: '70px',
          margin: '18px auto 0'
        },
        serviceCard: {
          padding: '20px 15px',
          gap: '15px',
          minHeight: '300px'
        },
        cardTitle: {
          fontSize: '1.25rem',
          marginBottom: '10px'
        },
        cardDesc: {
          fontSize: '0.85rem',
          marginBottom: '12px'
        },
        featureItem: {
          fontSize: '0.8rem',
          padding: '5px 0',
          gap: '8px'
        },
        featureIcon: {
          width: '18px',
          height: '18px',
          minWidth: '18px',
          fontSize: '0.85rem'
        },
        img: {
          maxWidth: '140px',
          maxHeight: '130px'
        },
        servicesGrid: {
          gap: '25px',
          marginTop: '40px'
        }
      };
    }
    return {};
  };

  const responsiveStyles = getResponsiveStyles();

  const styles = {
    section: {
      padding: '90px 20px',
      paddingTop: '110px',
      background: isDarkMode
        ? 'linear-gradient(135deg, #1f2937 0%, #0f172a 50%, #121212 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #f8fdfe 50%, #ffffff 100%)',
      textAlign: 'center',
      minHeight: '100vh',
      position: 'relative',
      margin: 0
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
      marginBottom: '60px',
      marginTop: 0,
      background: 'linear-gradient(135deg, var(--color-secondary), var(--color-third))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontFamily: "'Merriweather', serif",
      fontWeight: 600,
      position: 'relative'
    },
    h2After: {
      content: "''",
      width: '80px',
      height: '4px',
      background: 'linear-gradient(90deg, var(--color-secondary), var(--color-third))',
      margin: '20px auto 0',
      display: 'block',
      borderRadius: '2px'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      marginTop: '60px'
    },
    serviceCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '30px',
      padding: '30px 25px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
      border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      textAlign: 'center',
      minHeight: '350px'
    },
    cardBefore: {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, var(--color-secondary), var(--color-third))',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.4s ease'
    },
    cardBeforeHover: {
      transform: 'scaleX(1)'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    cardTitle: {
      fontSize: '1.5rem',
      marginBottom: '12px',
      color: isDarkMode ? '#e5e7eb' : 'var(--color-dark)',
      fontFamily: "'Merriweather', serif",
      fontWeight: 600
    },
    cardDesc: {
      fontSize: '0.95rem',
      marginBottom: '15px',
      color: isDarkMode ? '#9ca3af' : '#555',
      lineHeight: '1.6'
    },
    featuresContainer: {
      width: '100%',
      textAlign: 'left',
      marginTop: '10px'
    },
    featureItem: {
      fontSize: '0.9rem',
      marginBottom: '8px',
      color: isDarkMode ? '#d1d5db' : '#555',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '6px 0',
      transition: 'all 0.3s ease'
    },
    featureIcon: {
      color: 'var(--color-secondary)',
      fontWeight: 'bold',
      fontSize: '1rem',
      width: '20px',
      height: '20px',
      minWidth: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(13, 157, 184, 0.1)',
      borderRadius: '50%',
      flexShrink: 0,
      transition: 'all 0.3s ease',
      marginTop: '2px'
    },
    img: {
      width: '100%',
      maxWidth: '160px',
      height: 'auto',
      maxHeight: '150px',
      borderRadius: '15px',
      transition: 'transform 0.3s ease',
      filter: isDarkMode ? 'brightness(0.9) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))' : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
      marginTop: 'auto'
    },
    imgHover: {
      transform: 'scale(1.05)'
    }
  };

  const servicesData = [
    {
      id: 1,
      title: 'Analyze Symptoms',
      description: 'Check your symptoms using our advanced AI to get instant triage advice.',
      features: [
        'Clinical-grade AI analysis',
        'Instant triage recommendations',
        'Symptom severity assessment'
      ],
      image: '/assets/Symptomspage.svg',
      route: '/symptoms'
    },
    {
      id: 2,
      title: 'Disease Library',
      description: 'Search our verified medical library for detailed disease information.',
      features: [
        'Medically reviewed content',
        'Comprehensive disease database',
        'Easy-to-understand explanations'
      ],
      image: '/assets/diseas.svg',
      route: '/diseases-front'
    },
    {
      id: 3,
      title: 'Lab Report Analysis',
      description: 'Upload lab reports or medical imaging for AI-powered analysis and insights.',
      features: [
        'AI-powered report analysis',
        'Quick results interpretation',
        'Detailed health insights'
      ],
      image: '/assets/lab-analysis.svg',
      route: '/lab-analysis'
    },
    {
      id: 4,
      title: 'Free AI Assistant',
      description: 'Chat with DoctorXCare for personalized health guidance 24/7.',
      features: [
        '24/7 availability',
        'Personalized health guidance',
        'Instant medical advice'
      ],
      image: '/assets/hi.svg',
      route: '/doctorx-ai'
    },
    {
      id: 5,
      title: 'Chronic Care & Health Tracking',
      description: 'Long-term health management for patients with ongoing conditions.',
      features: [
        'Disease-specific monitoring for Diabetes, Hypertension, Thyroid',
        'Interactive trend visualization with Chart.js',
        'Lifestyle & vitals log for daily readings',
        'Preventive alerts for check-ups'
      ],
      image: '/assets/chronic-care.svg',
      route: '/chronic-care'
    },
    {
      id: 6,
      title: 'Post-Discharge Recovery',
      description: 'Support patients during the vulnerable period after leaving a hospital.',
      features: [
        'Condition-specific recovery checklists',
        'Danger sign monitoring education',
        'Mental wellbeing support integration'
      ],
      image: '/assets/recovery.svg',
      route: '/post-discharge'
    },
    {
      id: 7,
      title: 'Specialist Finder & Hospital Directory',
      description: 'Bridge the gap between digital guidance and physical care.',
      features: [
        'Nearby hospital locator with geolocation',
        'Smart specialist filters by expertise',
        'Direct booking integration'
      ],
      image: '/assets/specialist.svg',
      route: '/specialist-finder'
    }
  ];

  return (
    <section style={{ ...styles.section, ...responsiveStyles.section }}>
      <div style={styles.container}>
        <h2 style={{ ...styles.h2, ...responsiveStyles.h2 }}>
          Our Healthcare Services
          <span style={{ ...styles.h2After, ...responsiveStyles.h2After }}></span>
        </h2>

        <div style={{ ...styles.servicesGrid, ...responsiveStyles.servicesGrid }}>
          {servicesData.map((service) => (
            <div
              key={service.id}
              style={{
                ...(responsiveStyles.serviceCard || styles.serviceCard),
                ...(hoveredCard === service.id ? styles.cardHover : {})
              }}
              onClick={() => navigate(service.route)}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={{
                ...styles.cardBefore,
                ...(hoveredCard === service.id ? styles.cardBeforeHover : {})
              }}></span>

              <h3 style={{ ...styles.cardTitle, ...responsiveStyles.cardTitle }}>
                {service.title}
              </h3>

              <p style={{ ...styles.cardDesc, ...responsiveStyles.cardDesc }}>
                {service.description}
              </p>

              <div style={styles.featuresContainer}>
                {service.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{ ...styles.featureItem, ...responsiveStyles.featureItem }}
                  >
                    <span style={{ ...styles.featureIcon, ...responsiveStyles.featureIcon }}>
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <img
                src={service.image}
                alt={service.title}
                style={{
                  ...styles.img,
                  ...responsiveStyles.img,
                  ...(hoveredCard === service.id ? styles.imgHover : {})
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;