import logo from '/assets/MAINLOGO1.png';

function Footer() {
  const footerStyles = {
    background: 'var(--color-dark)',
    padding: '60px 20px 40px',
    fontFamily: '"Inter", sans-serif',
    borderTop: '1px solid #e5e5e5'
  };

  const footerContentStyles = {
    width: '100%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
    gap: '40px',
    marginBottom: '50px'
  };

  const companyInfoStyles = {
    paddingRight: '40px',
    marginLeft: '20%'
  };

  const logoContainerStyles = {
    marginBottom: '20px'
  };

  const logoPlaceholderStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const logoImageStyles = {
    height: '40px',
    width: 'auto'
  };

  const copyrightStyles = {
    fontSize: '0.9rem',
    color: 'var(--color-primary)',
    margin: '0 0 5px 0'
  };

  const rightsStyles = {
    fontSize: '0.9rem',
    color: 'var(--color-primary)',
    margin: '0 0 25px 0'
  };

  const socialIconsStyles = {
    display: 'flex',
    gap: '15px'
  };

  const socialIconLinkStyles = {
    width: '42px',
    height: '42px',
    background: 'var(--color-fourth)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-dark)',
    textDecoration: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--color-secondary)',
    borderOpacity: '0.2',
    position: 'relative',
    overflow: 'hidden'
  };


  const footerSectionH4Styles = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'var(--color-secondary)'
  };

  const footerSectionPStyles = {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--color-primary)',
    marginBottom: '12px'
  };

  const addressStyles = {
    marginBottom: '15px'
  };

  const contactInfoStyles = {
    marginBottom: '8px'
  };

  const contactLinkStyles = {
    color: 'var(--color-secondary)',
    textDecoration: 'none'
  };

  const ulStyles = {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  };

  const liStyles = {
    marginBottom: '5px'
  };

  const linkStyles = {
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s'
  };

  const legalLinksStyles = {
    marginTop: '9px'
  };

  const legalLinkStyles = {
    color: 'var(--color-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginRight: '15px',
    display: 'inline-block',
    marginBottom: '5px'
  };

  const disclaimerStyles = {
    width: '100%',
    margin: '0 auto',
    paddingTop: '20px',
    borderTop: '1px solid #e5e5e5'
  };

  const disclaimerH4Styles = {
    marginLeft: '2%',
    marginRight: '2%',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: 'var(--color-secondary)'
  };

  const disclaimerPStyles = {
    marginLeft: '2%',
    marginRight: '2%',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '15px',
    color: 'var(--color-primary)'
  };

  // SVG Icons for social media
  const TwitterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  const YouTubeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );

  const LinkedInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  // Responsive styles with modern dark mode styling
  const mediaQueryStyles = `
    :root {
      /* Light mode */
      --color-primary: #ffffff;   /* clean white */
      --color-secondary: #0d9db8; /* medical teal */
      --color-third: #3b82f6;     /* trust blue */
      --color-fourth: #d1f4f9;    /* soft aqua background */
      --color-dark: #1a1a1a;      /* text dark gray */
    }

    /* Dark mode */
    [data-theme="dark"] {
      --color-primary: #121212;   /* dark background */
      --color-secondary: #0d9db8; /* same teal for consistency */
      --color-third: #60a5fa;     /* lighter blue for dark mode */
      --color-fourth: #1f2937;    /* soft grayish background */
      --color-dark: #e5e7eb;      /* light gray text */
    }

    @media (max-width: 768px) {
      .footer-content-responsive {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      .company-info-responsive {
        padding-right: 0 !important;
        margin-left: 0 !important;
      }
      .footer-responsive {
        padding: 40px 20px 30px !important;
      }
    }
    
    @media (max-width: 1024px) and (min-width: 769px) {
      .footer-content-responsive {
        grid-template-columns: 1fr 1fr !important;
        gap: 40px !important;
      }
    }

    /* Modern glassmorphism hover effects */
    .social-icon-modern {
      position: relative;
      overflow: hidden;
    }
    
    .social-icon-modern::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
      opacity: 0.3;
      transition: left 0.5s;
      z-index: 1;
    }
    
    .social-icon-modern:hover::before {
      left: 100%;
    }
    
    .social-icon-modern::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, var(--color-secondary) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    }
    
    .social-icon-modern:hover::after {
      opacity: 0.1;
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      <footer style={footerStyles} className="footer-responsive">
        <div style={footerContentStyles} className="footer-content-responsive">
          {/* Logo and Company Info */}
          <div style={companyInfoStyles} className="company-info-responsive">
            <div style={logoContainerStyles}>
              <div style={logoPlaceholderStyles}>
                <img
                  src={logo}
                  alt="DoctorX Logo"
                  style={logoImageStyles}
                />
              </div>
            </div>
            <p style={copyrightStyles}>© 2025 DoctorX</p>
            <p style={rightsStyles}>All rights reserved</p>

            {/* Social Media Icons */}
            <div style={socialIconsStyles}>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="social-icon-modern"
                style={socialIconLinkStyles}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 10px 25px rgba(13, 157, 184, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--color-fourth)';
                  e.target.style.color = 'var(--color-dark)';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="social-icon-modern"
                style={socialIconLinkStyles}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 10px 25px rgba(13, 157, 184, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--color-fourth)';
                  e.target.style.color = 'var(--color-dark)';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="social-icon-modern"
                style={socialIconLinkStyles}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 10px 25px rgba(13, 157, 184, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--color-fourth)';
                  e.target.style.color = 'var(--color-dark)';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com/company/doctorx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
                className="social-icon-modern"
                style={socialIconLinkStyles}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 10px 25px rgba(13, 157, 184, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--color-fourth)';
                  e.target.style.color = 'var(--color-dark)';
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 style={footerSectionH4Styles}>Get in Touch</h4>
            <p style={{ ...footerSectionPStyles, ...addressStyles }}>
              Pocket-4 Phi-2 Greater Noida<br />
              India, 201310
            </p>
            <p style={{ ...footerSectionPStyles, ...contactInfoStyles }}>
              Email: <a
                href="mailto:arunstp45@gmail.com"
                style={contactLinkStyles}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                arunstp45@gmail.com
              </a>
            </p>
            <p style={{ ...footerSectionPStyles, ...contactInfoStyles }}>
              Phone: <a
                href="tel:+91*******662"
                style={contactLinkStyles}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                +91 *******662
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={footerSectionH4Styles}>Quick Links</h4>
            <ul style={ulStyles}>
              <li style={liStyles}>
                <a
                  href="/about"
                  style={linkStyles}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  About Us
                </a>
              </li>
              <li style={liStyles}>
                <a
                  href="#"
                  style={linkStyles}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  Symptom Checker
                </a>
              </li>
              <li style={liStyles}>
                <a
                  href="#"
                  style={linkStyles}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  Disease Details
                </a>
              </li>
              <li style={liStyles}>
                <a
                  href="/audience"
                  style={linkStyles}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  Audience
                </a>
              </li>
              <li style={liStyles}>
                <a
                  href="/contact"
                  style={linkStyles}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & More Info */}
          <div>
            <h4 style={footerSectionH4Styles}>Learn More</h4>
            <div style={legalLinksStyles}>
              <a
                href="/terms"
                style={legalLinkStyles}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Terms of Service
              </a><br />
              <a
                href="/terms"
                style={legalLinkStyles}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Privacy Policy
              </a><br />
              <a
                href="/terms"
                style={legalLinkStyles}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Cookies Policy
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div style={disclaimerStyles}>
          <h4 style={disclaimerH4Styles}>Disclaimer</h4>
          <p style={disclaimerPStyles}>
            DoctorX is an independent web project created in India for informational and educational purposes. It is not a licensed or certified medical device under Indian authorities such as the Central Drugs Standard Control Organization (CDSCO) or the Medical Device Rules, 2017, nor under international regulators such as the FDA (United States) or the CE marking system (European Union). For more information on its intended use, please see our Terms of Service.
          </p>
          <p style={disclaimerPStyles}>
            DoctorX does not provide professional medical advice, diagnosis, or treatment. It is designed only to give general health-related information that may help guide your next steps. Always seek the advice of a qualified healthcare professional with any questions or concerns regarding a medical condition.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;