import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';

import contactImage from "/assets/c1.svg";
import doctorXLogo from "/assets/MAINLOGO2.png";

function ContactPage() {
  const [toast, setToast] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const location = useLocation();

  // Load feedbacks from JSON file
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoadingFeedbacks(true);
        setFeedbackError(null);

        // Multiple fetch attempts with better error handling
        let response;
        const pathsToTry = [
          '/data/feedbacks.json',
          '/public/data/feedbacks.json',
          'data/feedbacks.json',
          './data/feedbacks.json'
        ];

        for (const path of pathsToTry) {
          try {
            response = await fetch(path);
            if (response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setFeedbacks(Array.isArray(data) ? data : []);
                setLoadingFeedbacks(false);
                return;
              }
            }
          // eslint-disable-next-line no-unused-vars
          } catch (err) {
            console.log(`Path ${path} failed, trying next...`);
            continue;
          }
        }

        // If all paths fail, use fallback data
        throw new Error('All fetch paths failed');
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        setFeedbackError(null);

        // Fallback to sample data
        setFeedbacks([
          {
            id: 1,
            name: "Rahul Sharma",
            type: "suggestion",
            message: "Great platform! The symptom checker is very helpful. Would love to see more personalized health tips.",
            reply: {
              from: "DoctorX Team",
              message: "Thank you for your valuable feedback! We're working on personalized health recommendations."
            }
          },
          {
            id: 2,
            name: "Priya Patel",
            type: "compliment",
            message: "Excellent service! The disease information is comprehensive and easy to understand. Keep up the great work!"
          },
          {
            id: 3,
            name: "Amit Kumar",
            type: "feature_request",
            message: "Could you add a feature to track medication schedules? That would be really useful for chronic patients.",
            reply: {
              from: "DoctorX Team",
              message: "Great idea! We're planning to add medication tracking in our next update."
            }
          }
        ]);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    loadFeedbacks();
  }, []);

  // Check for dark theme
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  // Page loader timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Inject keyframe animations
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes progress {
        0% { transform: scaleX(1); }
        100% { transform: scaleX(0); }
      }
      
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes fadeInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes fadeInRight {
        from { 
          opacity: 0; 
          transform: translateX(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @media (max-width: 576px) {
        .toast-container-mobile {
          top: 10px !important;
          right: 10px !important;
          left: 10px !important;
        }
        
        .toast-mobile {
          min-width: unset !important;
          max-width: unset !important;
          transform: translateY(-100px) !important;
        }
        
        .toast-mobile.show {
          transform: translateY(0) !important;
        }
      }

      .feedback-scroll-container {
        scrollbar-width: thin;
        scrollbar-color: var(--color-secondary) transparent;
      }

      .feedback-scroll-container::-webkit-scrollbar {
        height: 8px;
      }

      .feedback-scroll-container::-webkit-scrollbar-track {
        background: transparent;
      }

      .feedback-scroll-container::-webkit-scrollbar-thumb {
        background: var(--color-secondary);
        border-radius: 4px;
      }

      .feedback-scroll-container::-webkit-scrollbar-thumb:hover {
        background: var(--color-third);
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Show toast when redirected back from Web3Forms
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'true') {
      setToast({
        type: 'success',
        title: 'Feedback Submitted Successfully!',
        message: 'Thank you for your feedback. We appreciate your input and will review it carefully.'
      });
      setFeedbackSubmitted(true);
    } else if (error === 'true') {
      setToast({
        type: 'error',
        title: 'Failed to Submit Feedback',
        message: 'Sorry, there was an error submitting your feedback. Please try again.'
      });
    }

    if (success === 'true' || error === 'true') {
      const timer = setTimeout(() => {
        setToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const closeToast = () => {
    setToast(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  const handleEditFeedback = () => {
    setFeedbackSubmitted(false);
    setToast(null);
  };

  const scrollFeedback = (direction) => {
    const container = document.getElementById('feedback-scroll');
    const scrollAmount = 400;
    if (container) {
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Page loader styles
  const pageLoaderOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: isDarkTheme ? '#000' : '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const loaderContainerStyle = {
    textAlign: 'center'
  };

  const loaderStyle = {
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
    position: 'relative'
  };

  const loaderAfterStyle = {
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
    animation: 'rotation 0.5s linear infinite reverse'
  };

  const loaderTextStyle = {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: 'var(--color-secondary)',
    fontWeight: '600',
    fontFamily: "'Merriweather', serif"
  };

  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth <= 575,
    isTablet: window.innerWidth <= 991,
    isSmallDesktop: window.innerWidth <= 1199
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth <= 575,
        isTablet: window.innerWidth <= 991,
        isSmallDesktop: window.innerWidth <= 1199
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageStyle = () => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      fontFamily: '"Merriweather", serif'
    };

    return baseStyle;
  };

  const getContactSectionStyle = () => {
    const baseStyle = {
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      background: isDarkTheme
        ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
        : 'linear-gradient(135deg, var(--color-fourth) 0%, #f8fdfe 50%, var(--color-primary) 100%)',
      transition: 'background 0.4s ease-in-out'
    };

    if (screenSize.isTablet) {
      return {
        ...baseStyle,
        flexDirection: 'column',
        paddingTop: '70px'
      };
    }

    return baseStyle;
  };

  const getLeftSectionStyle = () => {
    const baseStyle = {
      flex: 1,
      color: 'var(--color-secondary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 0,
      animation: 'fadeInLeft 0.8s ease-in-out forwards'
    };

    if (screenSize.isMobile) {
      return {
        ...baseStyle,
        padding: '20px',
        minHeight: '250px',
        order: -1
      };
    }

    if (screenSize.isTablet) {
      return {
        ...baseStyle,
        padding: '40px 30px',
        minHeight: '300px'
      };
    }

    return {
      ...baseStyle,
      padding: '40px'
    };
  };

  const leftTitleStyle = {
    fontSize: screenSize.isMobile ? '24px' : screenSize.isTablet ? '28px' : '32px',
    marginBottom: '12px',
    fontWeight: 600,
    lineHeight: 1.2
  };

  const leftDescStyle = {
    color: 'var(--color-dark)',
    fontSize: screenSize.isMobile ? '14px' : '16px',
    marginBottom: '20px',
    opacity: 0.9,
    lineHeight: 1.6,
    maxWidth: screenSize.isTablet ? '600px' : 'none'
  };

  const leftImageStyle = {
    maxWidth: screenSize.isTablet ? '60%' : '80%',
    height: 'auto',
    marginTop: '20px'
  };

  const getRightSectionStyle = () => {
    const baseStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      animation: 'fadeInRight 0.8s ease-in-out forwards'
    };

    if (screenSize.isMobile) {
      return {
        ...baseStyle,
        padding: '20px',
        minHeight: 'auto',
        alignItems: 'flex-start',
        paddingTop: '20px'
      };
    }

    if (screenSize.isTablet) {
      return {
        ...baseStyle,
        padding: '40px 30px',
        minHeight: '60vh'
      };
    }

    return {
      ...baseStyle,
      padding: '40px'
    };
  };

  const formBoxStyle = {
    width: '100%',
    maxWidth: screenSize.isMobile ? 'none' : '700px',
    animation: 'fadeInUp 0.8s ease-in-out forwards'
  };

  const formTitleStyle = {
    fontSize: screenSize.isMobile ? '1.8rem' : screenSize.isTablet ? '2.1rem' : '2.3rem',
    fontWeight: 600,
    marginBottom: screenSize.isMobile ? '16px' : '20px',
    marginTop: screenSize.isMobile ? '40px' : '0px',
    color: 'var(--color-secondary)',
    fontFamily: '"Merriweather", serif',
    lineHeight: 1.2,
    textAlign: screenSize.isMobile ? 'center' : 'left'
  };

  const subtitleStyle = {
    fontSize: screenSize.isMobile ? '0.9rem' : '1rem',
    color: 'var(--color-dark)',
    marginBottom: '24px',
    lineHeight: 1.5,
    textAlign: screenSize.isMobile ? 'center' : 'left'
  };

  const getInputStyle = () => {
    const baseStyle = {
      width: '100%',
      border: 'none',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      fontFamily: '"Inter", sans-serif',
      background: isDarkTheme ? 'rgba(55, 65, 81, 0.8)' : 'rgba(107, 114, 128, 0.1)',
      color: isDarkTheme ? '#e5e7eb' : '#374151',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: isDarkTheme
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    };

    if (screenSize.isMobile) {
      return {
        ...baseStyle,
        padding: '18px 20px',
        fontSize: '16px',
        marginBottom: '16px'
      };
    }

    return {
      ...baseStyle,
      padding: '18px 20px',
      fontSize: '16px',
      marginBottom: '16px'
    };
  };

  const getTextareaStyle = () => {
    const inputStyle = getInputStyle();
    return {
      ...inputStyle,
      minHeight: screenSize.isMobile ? '120px' : '140px',
      resize: 'vertical',
      lineHeight: 1.6,
      paddingTop: '20px'
    };
  };

  const getButtonStyle = () => {
    const baseStyle = {
      width: '100%',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 600,
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: isSubmitting
        ? 'rgba(var(--color-secondary-rgb), 0.7)'
        : 'var(--color-secondary)',
      color: 'var(--color-dark)'
    };

    if (screenSize.isMobile) {
      return {
        ...baseStyle,
        padding: '18px 24px',
        fontSize: '16px',
        marginTop: '28px'
      };
    }

    return {
      ...baseStyle,
      padding: '16px 24px',
      fontSize: '16px',
      marginTop: '24px'
    };
  };

  const backLinkStyle = {
    marginTop: '15px',
    fontSize: screenSize.isMobile ? '13px' : '14px',
    color: isDarkTheme ? '#acb2b9ff' : '#717171ff',
    textAlign: screenSize.isMobile ? 'center' : 'left'
  };

  const linkStyle = {
    color: 'var(--color-dark)',
    textDecoration: 'none',
    fontWeight: 500
  };

  const toastContainerStyle = {
    position: 'fixed',
    top: screenSize.isMobile ? '10px' : '20px',
    right: screenSize.isMobile ? '10px' : '20px',
    left: screenSize.isMobile ? '10px' : 'auto',
    zIndex: 9999,
    pointerEvents: 'none'
  };

  const toastBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: isDarkTheme ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: screenSize.isMobile ? '14px 16px' : '16px 20px',
    minWidth: screenSize.isMobile ? 'unset' : '300px',
    maxWidth: screenSize.isMobile ? 'unset' : '400px',
    boxShadow: isDarkTheme ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
    transform: toast ? (screenSize.isMobile ? 'translateY(0)' : 'translateX(0)') : (screenSize.isMobile ? 'translateY(-100px)' : 'translateX(400px)'),
    opacity: toast ? 1 : 0,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    pointerEvents: 'all',
    position: 'relative',
    overflow: 'hidden'
  };

  const getToastStyle = () => {
    if (!toast) return toastBaseStyle;

    const borderLeftColor = toast.type === 'success' ? '#10b981' :
      toast.type === 'error' ? '#ef4444' : '#3b82f6';

    return {
      ...toastBaseStyle,
      borderLeft: `4px solid ${borderLeftColor}`
    };
  };

  const toastIconStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '14px',
    fontWeight: 600,
    background: toast?.type === 'success' ? '#10b981' :
      toast?.type === 'error' ? '#ef4444' : '#3b82f6',
    color: 'white'
  };

  const toastTitleStyle = {
    fontWeight: 600,
    fontSize: screenSize.isMobile ? '13px' : '14px',
    color: isDarkTheme ? '#f8fafc' : '#1f2937',
    marginBottom: '2px'
  };

  const toastMessageStyle = {
    fontSize: screenSize.isMobile ? '12px' : '13px',
    color: isDarkTheme ? '#cbd5e1' : '#6b7280',
    lineHeight: 1.4
  };

  const toastCloseStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    transition: 'all 0.2s',
    flexShrink: 0
  };

  const toastProgressStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    background: toast?.type === 'success' ? 'linear-gradient(90deg, #10b981, #059669)' :
      toast?.type === 'error' ? 'linear-gradient(90deg, #ef4444, #dc2626)' :
        'linear-gradient(90deg, #3b82f6, #2563eb)',
    borderRadius: '0 0 16px 16px',
    transformOrigin: 'left',
    animation: 'progress 6s linear forwards'
  };

  // Feedback section styles
  const feedbackSectionStyle = {
    width: '100%',
    margin: '0 auto',
    padding: '40px 20px',
    background: isDarkTheme
      ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
      : 'linear-gradient(135deg, var(--color-fourth) 0%, #f8fdfe 50%, var(--color-primary) 100%)',
    position: 'relative',
    transition: 'background 0.4s ease-in-out'
  };

  const feedbackHeaderStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const feedbackTitleStyle = {
    fontSize: screenSize.isMobile ? '1.5rem' : '2rem',
    fontWeight: 700,
    color: 'var(--color-secondary)',
    fontFamily: '"Merriweather", serif',
    marginBottom: '8px'
  };

  const feedbackSubtitleStyle = {
    fontSize: screenSize.isMobile ? '1.2rem' : '1.5rem',
    fontWeight: 600,
    color: 'var(--color-dark)',
    fontFamily: '"Merriweather", serif'
  };

  const feedbackScrollContainerStyle = {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: '10px',
    scrollBehavior: 'smooth',
    maxWidth: '1160px',
    margin: '0 auto'
  };

  const feedbackCardStyle = {
    minWidth: '350px',
    maxWidth: '350px',
    background: isDarkTheme ? 'var(--color-primary)' : '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const feedbackQuoteStyle = {
    fontSize: '3rem',
    color: 'var(--color-secondary)',
    lineHeight: 0.5,
    fontFamily: 'serif'
  };

  const feedbackUserStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const feedbackAvatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--color-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 600,
    fontSize: '1.2rem'
  };

  const feedbackNameContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const feedbackNameStyle = {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-dark)'
  };

  const feedbackTypeStyle = {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-secondary)',
    textTransform: 'capitalize'
  };

  const feedbackMessageStyle = {
    fontSize: '0.9rem',
    color: 'var(--color-dark)',
    lineHeight: 1.6,
    flex: 1
  };

  const feedbackReplyStyle = {
    background: isDarkTheme ? 'rgba(55, 65, 81, 0.5)' : 'rgba(209, 244, 249, 0.5)',
    borderLeft: '3px solid var(--color-secondary)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '8px'
  };

  const feedbackReplyHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  };

  const feedbackReplyAvatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  const feedbackReplyLogoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const feedbackReplyFromStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-secondary)'
  };

  const feedbackReplyMessageStyle = {
    fontSize: '0.85rem',
    color: 'var(--color-dark)',
    lineHeight: 1.5
  };

  const scrollButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--color-secondary)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    zIndex: 10
  };

  const loadingStateStyle = {
    textAlign: 'center',
    padding: '40px 20px'
  };

  const loadingTextStyle = {
    fontSize: '1rem',
    color: 'var(--color-secondary)',
    animation: 'pulse 2s infinite'
  };

  const errorStateStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#dc2626'
  };

  if (pageLoading) {
    return (
      <div style={pageLoaderOverlayStyle}>
        <div style={loaderContainerStyle}>
          <div style={loaderStyle}>
            <div style={loaderAfterStyle}></div>
          </div>
          <p style={loaderTextStyle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={getPageStyle()}>
        {/* Contact Form Section */}
        <div style={getContactSectionStyle()}>
          {/* Left Section - Illustration */}
          <div style={getLeftSectionStyle()}>
            <h1 style={leftTitleStyle}>Share Your Thoughts With Us</h1>
            <p style={leftDescStyle}>We value your opinion and strive to improve our services. Your feedback helps us serve you better.</p>
            <img src={contactImage} alt="Contact DoctorX" style={leftImageStyle} />
          </div>

          {/* Right Section - Contact Form */}
          <div style={getRightSectionStyle()}>
            <div style={formBoxStyle}>
              <h2 style={formTitleStyle}>Feedback Form</h2>
              <p style={subtitleStyle}>
                {feedbackSubmitted
                  ? "Your feedback has been submitted successfully! You can edit and resubmit if needed."
                  : "Help us improve by sharing your thoughts, suggestions, or reporting any issues you've encountered."
                }
              </p>

              {feedbackSubmitted && (
                <div style={{
                  background: isDarkTheme ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: screenSize.isMobile ? '14px' : '16px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#10b981',
                    fontWeight: 500,
                    fontSize: screenSize.isMobile ? '13px' : '14px'
                  }}>
                    ✓ Feedback submitted successfully!
                  </p>
                  <button
                    onClick={handleEditFeedback}
                    style={{
                      background: 'none',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#10b981',
                      padding: screenSize.isMobile ? '6px 14px' : '8px 16px',
                      fontSize: screenSize.isMobile ? '12px' : '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      marginTop: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#10b981';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#10b981';
                    }}
                  >
                    Edit Feedback
                  </button>
                </div>
              )}

              <form
                style={{ width: '100%', opacity: feedbackSubmitted ? 0.6 : 1 }}
                action="https://api.web3forms.com/submit"
                method="POST"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="access_key" value="c914087f-8d40-4075-9c03-7962908ae282" />
                <input type="hidden" name="subject" value="New Feedback Submission - DoctorX" />

                <div style={{
                  display: 'flex',
                  gap: screenSize.isMobile ? '12px' : '16px',
                  marginBottom: '0',
                  flexDirection: screenSize.isMobile ? 'column' : 'row'
                }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    disabled={feedbackSubmitted}
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      ...getInputStyle(),
                      flex: screenSize.isMobile ? 'unset' : 1,
                      marginBottom: '16px',
                      opacity: feedbackSubmitted ? 0.6 : 1
                    }}
                    onFocus={(e) => !feedbackSubmitted && (e.target.style.transform = 'translateY(-2px)')}
                    onBlur={(e) => e.target.style.transform = 'translateY(0)'}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    disabled={feedbackSubmitted}
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      ...getInputStyle(),
                      flex: screenSize.isMobile ? 'unset' : 1,
                      marginBottom: '16px',
                      opacity: feedbackSubmitted ? 0.6 : 1
                    }}
                    onFocus={(e) => !feedbackSubmitted && (e.target.style.transform = 'translateY(-2px)')}
                    onBlur={(e) => e.target.style.transform = 'translateY(0)'}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: screenSize.isMobile ? '12px' : '16px',
                  marginBottom: '0',
                  flexDirection: screenSize.isMobile ? 'column' : 'row'
                }}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    disabled={feedbackSubmitted}
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      ...getInputStyle(),
                      flex: screenSize.isMobile ? 'unset' : 1,
                      marginBottom: '16px',
                      opacity: feedbackSubmitted ? 0.6 : 1
                    }}
                    onFocus={(e) => !feedbackSubmitted && (e.target.style.transform = 'translateY(-2px)')}
                    onBlur={(e) => e.target.style.transform = 'translateY(0)'}
                  />

                  <select
                    name="feedback_type"
                    required
                    disabled={feedbackSubmitted}
                    style={{
                      ...getInputStyle(),
                      flex: screenSize.isMobile ? 'unset' : 1,
                      marginBottom: '16px',
                      opacity: feedbackSubmitted ? 0.6 : 1,
                      cursor: feedbackSubmitted ? 'not-allowed' : 'pointer'
                    }}
                    onFocus={(e) => !feedbackSubmitted && (e.target.style.transform = 'translateY(-2px)')}
                    onBlur={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <option value="">Feedback Type</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="general">General Feedback</option>
                    <option value="complaint">Complaint</option>
                    <option value="compliment">Compliment</option>
                  </select>
                </div>

                <textarea
                  name="message"
                  placeholder="Share your detailed feedback here... Tell us about your experience, suggestions for improvement, or any issues you've encountered."
                  required
                  disabled={feedbackSubmitted}
                  value={formData.message}
                  onChange={handleInputChange}
                  style={{
                    ...getTextareaStyle(),
                    opacity: feedbackSubmitted ? 0.6 : 1
                  }}
                  onFocus={(e) => !feedbackSubmitted && (e.target.style.transform = 'translateY(-2px)')}
                  onBlur={(e) => e.target.style.transform = 'translateY(0)'}
                />

                <button
                  type="submit"
                  disabled={feedbackSubmitted || isSubmitting}
                  style={{
                    ...getButtonStyle(),
                    opacity: feedbackSubmitted ? 0.4 : 1,
                    cursor: feedbackSubmitted ? 'not-allowed' : (isSubmitting ? 'wait' : 'pointer')
                  }}
                  onMouseEnter={(e) => {
                    if (!feedbackSubmitted && !isSubmitting && !screenSize.isMobile) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!screenSize.isMobile) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting Feedback...' :
                    feedbackSubmitted ? 'Feedback Submitted ✓' : 'Submit Feedback'}
                </button>
              </form>

              <p style={backLinkStyle}>
                <Link
                  to="/"
                  style={linkStyle}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  ← Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Client Feedback Section */}
        <div style={feedbackSectionStyle}>
          <div style={feedbackHeaderStyle}>
            <h2 style={feedbackTitleStyle}>Some Of Our Clients</h2>
            <h3 style={feedbackSubtitleStyle}>Saying About Us</h3>
          </div>

          {loadingFeedbacks ? (
            <div style={loadingStateStyle}>
              <div style={loadingTextStyle}>Loading client feedbacks...</div>
            </div>
          ) : feedbackError ? (
            <div style={errorStateStyle}>
              <p>{feedbackError}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={loadingStateStyle}>
              <p style={{ color: 'var(--color-dark)' }}>No feedbacks available yet.</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                style={{ ...scrollButtonStyle, left: '10px' }}
                onClick={() => scrollFeedback('left')}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
              >
                <ChevronLeft size={24} />
              </button>

              <div
                id="feedback-scroll"
                className="feedback-scroll-container"
                style={feedbackScrollContainerStyle}
              >
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} style={feedbackCardStyle}>
                    <div style={feedbackQuoteStyle}>"</div>

                    <div style={feedbackUserStyle}>
                      <div style={feedbackAvatarStyle}>
                        {feedback.name.charAt(0)}
                      </div>
                      <div style={feedbackNameContainerStyle}>
                        <div style={feedbackNameStyle}>{feedback.name}</div>
                        <div style={feedbackTypeStyle}>{feedback.type}</div>
                      </div>
                    </div>

                    <p style={feedbackMessageStyle}>
                      {feedback.message}
                    </p>

                    {feedback.reply && (
                      <div style={feedbackReplyStyle}>
                        <div style={feedbackReplyHeaderStyle}>
                          <div style={feedbackReplyAvatarStyle}>
                            <img
                              src={doctorXLogo}
                              alt="DoctorX"
                              style={feedbackReplyLogoStyle}
                            />
                          </div>
                          <span style={feedbackReplyFromStyle}>{feedback.reply.from}</span>
                        </div>
                        <p style={feedbackReplyMessageStyle}>
                          {feedback.reply.message}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                style={{ ...scrollButtonStyle, right: '10px' }}
                onClick={() => scrollFeedback('right')}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Toast Container */}
        {toast && (
          <div style={toastContainerStyle}>
            <div style={getToastStyle()}>
              <div style={toastIconStyle}>
                {toast.type === 'success' && '✓'}
                {toast.type === 'error' && '✕'}
                {toast.type === 'info' && 'i'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={toastTitleStyle}>{toast.title}</div>
                <div style={toastMessageStyle}>{toast.message}</div>
              </div>
              <button
                style={toastCloseStyle}
                onClick={closeToast}
                onMouseEnter={(e) => {
                  e.target.style.background = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                  e.target.style.color = isDarkTheme ? '#e5e7eb' : '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#9ca3af';
                }}
              >
                ✕
              </button>
              <div style={toastProgressStyle}></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactPage;