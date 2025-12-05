import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

import contactImage from "/assets/c1.svg";
import doctorXLogo from "/assets/MAINLOGO2.png";

// --- STATIC FEEDBACKS DATA ---
const staticFeedbacks = [
  {
    id: "static_1",
    name: "Kunj Maheshwari",
    message: "Your hardwork paid well. It is a nice website one can visit to check for minor health issues.",
    type: "compliment",
    rating: 5,
    
  },
  {
    id: "static_2",
    name: "Gopal",
    message: "Good one. 👍",
    type: "general",
    rating: 4,
  },
  {
    id: "static_3",
    name: "Abhishek Singh",
    message: "The website you designed is wonderful working very smoothly 😃",
    type: "compliment",
    rating: 5,
  },
  {
    id: "static_4",
    name: "Meesam",
    message: "Great UI, Really Well Made. Keep up Devs",
    type: "compliment",
    rating: 5,
  },
  {
    id: "static_5",
    name: "Rahul Singh",
    message: "this is great website for normal patients. Well done.",
    type: "compliment",
    rating: 5,
  },
  {
    id: "static_6",
    name: "Nishant Dixit",
    message: "Good app for future",
    type: "feature_request",
    rating: 4,
  },
  {
    id: "static_7",
    name: "Kartik",
    message: "DoctorX is an excellent platform for patients seeking a clear understanding of their health conditions.It helps them know which specialist to consult.It's very useful and informative!",
    type: "compliment",
    rating: 5,
  },
  {
    id: "static_8",
    name: "Prateek Singh",
    message: "Ya it's good if u fill the symptoms u know the symptoms in earlier stage ....great",
    type: "general",
    rating: 4,
  },
  {
    id: "static_9",
    name: "Saumya Singh",
    message: "This app is very informative and easy to use! It helps users learn about possible diseases and find suitable doctors quickly.",
    type: "compliment",
    rating: 5,
  },
  {
    id: "static_10",
    name: "Anuj Pratap Singh",
    message: "This app is very helpful. It provides important information for patients to understand their symptoms and find the right doctor. It's a great initiative for basic health awareness.",
    type: "general",
    rating: 5,
  },
  {
    id: "static_11",
    name: "Amardeep Deep Singh",
    message: "This is the very useful app. It's very important for general patients for their basic information to identify the disease and identify the doctor which is more important.",
    type: "general",
    rating: 5,
  },
  {
    id: "static_12",
    name: "Vikas Kumar",
    message: "Experience is good but site is too slow.",
    type: "general",
    rating: 3,
    reply: { from: "DoctorXCare(By Arun)", message: "Hi Vikas, Thank you for pointing out the performance issue. I've optimized the platform for better speed." }
  },
  {
    id: "static_13",
    name: "Mayank Mishra",
    message: "Best.",
    type: "compliment",
    rating: 5,
  },
  {
    id: "static_14",
    name: "Client Name",
    message: "All I can say in a nutshell is what an amazing work and team! I am so thankful for coming across you all.",
    type: "general",
    rating: 5,
    reply: { from: "DoctorX(Arun)", message: "Dear Valued Client, Your kind words truly mean the world to me. I'm honored to serve you and grateful for your trust." }
  }
];

function ContactPage() {
  const [toast, setToast] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [feedbacks, setFeedbacks] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feedback_type: '',
    message: ''
  });

  // --- MERGE FIREBASE DATA WITH STATIC DATA ---
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const firebaseData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Anonymous",
            message: data.message || "",
            type: data.type || "general",
            rating: data.rating || 5,
            createdAt: data.createdAt,
            reply: data.reply || null
          };
        });

        // Combine Firebase data (Newest First) + Static Data
        setFeedbacks([...firebaseData, ...staticFeedbacks]);

      } catch (error) {
        console.error('Error loading feedbacks:', error);
        // Even if Firebase fails, show static feedbacks
        setFeedbacks(staticFeedbacks);
      }
    };
    loadFeedbacks();
  }, []);

  // Theme & Loader logic
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  // Animations
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes progress { 0% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
      @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      
      .star-icon { transition: all 0.2s ease; cursor: pointer; }
      .star-icon:hover { transform: scale(1.2); }
      
      .feedback-scroll-container::-webkit-scrollbar { height: 8px; }
      .feedback-scroll-container::-webkit-scrollbar-track { background: transparent; }
      .feedback-scroll-container::-webkit-scrollbar-thumb { background: var(--color-secondary); border-radius: 4px; }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message || !formData.feedback_type) {
      setToast({ type: 'error', title: 'Error', message: 'Please fill all required fields.' });
      return;
    }

    if (rating === 0) {
      setToast({ type: 'error', title: 'Rating Required', message: 'Please give us a star rating.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add to Firebase
      const docRef = await addDoc(collection(db, "feedbacks"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "N/A",
        type: formData.feedback_type,
        message: formData.message,
        rating: rating,
        createdAt: serverTimestamp(),
        status: "new"
      });

      // Update UI immediately (add to top)
      const newFeedback = {
        id: docRef.id,
        name: formData.name,
        type: formData.feedback_type,
        message: formData.message,
        rating: rating,
        createdAt: new Date(),
      };

      setFeedbacks((prev) => [newFeedback, ...prev]);

      setFeedbackSubmitted(true);
      setToast({
        type: 'success',
        title: 'Feedback Sent!',
        message: 'Your feedback is now live below!'
      });

      setFormData({ name: '', email: '', phone: '', feedback_type: '', message: '' });
      setRating(0);

      // Scroll to feedback section
      setTimeout(() => {
        document.getElementById('client-feedback-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);

    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Check your internet connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFeedback = () => {
    setFeedbackSubmitted(false);
    setToast(null);
  };

  const closeToast = () => setToast(null);

  const scrollFeedback = (direction) => {
    const container = document.getElementById('feedback-scroll');
    const scrollAmount = 350;
    if (container) {
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Styles
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth <= 575,
    isTablet: window.innerWidth <= 991
  });

  useEffect(() => {
    const handleResize = () => setScreenSize({
      isMobile: window.innerWidth <= 575,
      isTablet: window.innerWidth <= 991
    });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInputStyle = () => ({
    width: '100%',
    padding: screenSize.isMobile ? '18px 20px' : '18px 20px',
    marginBottom: '16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: screenSize.isMobile ? '16px' : '16px',
    outline: 'none',
    background: isDarkTheme ? 'rgba(55, 65, 81, 0.8)' : 'rgba(107, 114, 128, 0.1)',
    color: isDarkTheme ? '#e5e7eb' : '#374151',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: '"Inter", sans-serif',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: isDarkTheme
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  });

  const getButtonStyle = () => ({
    width: '100%',
    padding: screenSize.isMobile ? '18px 24px' : '16px 24px',
    background: isSubmitting
      ? 'rgba(13, 157, 184, 0.7)'
      : '#0d9db8',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: isSubmitting ? 'wait' : 'pointer',
    marginTop: screenSize.isMobile ? '28px' : '24px',
    opacity: isSubmitting ? 0.7 : 1,
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  });

  const feedbackCardStyle = {
    minWidth: '350px',
    maxWidth: '350px',
    background: isDarkTheme ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    border: isDarkTheme ? '1px solid #334155' : '1px solid #e2e8f0',
    flexShrink: 0
  };

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

  const loaderStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'inline-block',
    borderTop: '4px solid #0d9db8',
    borderRight: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '4px solid transparent',
    boxSizing: 'border-box',
    animation: 'rotation 1s linear infinite',
    position: 'relative'
  };

  const loaderTextStyle = {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: '#0d9db8',
    fontWeight: '600',
    fontFamily: "'Merriweather', serif"
  };

  if (pageLoading) {
    return (
      <div style={pageLoaderOverlayStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={loaderStyle}></div>
          <p style={loaderTextStyle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginTop: '60px', fontFamily: '"Merriweather", serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Main Section */}
        <div style={{
          display: 'flex',
          flexDirection: screenSize.isTablet ? 'column' : 'row',
          background: isDarkTheme
            ? 'linear-gradient(135deg, #1f2937, #0f172a)'
            : 'linear-gradient(135deg, #d1f4f9, #f8fdfe)',
          minHeight: '100vh'
        }}>

          {/* Left Side */}
          <div style={{ flex: 1, padding: screenSize.isMobile ? '20px' : '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', animation: 'fadeInLeft 0.8s ease' }}>
            <h1 style={{ color: '#0d9db8', fontSize: screenSize.isMobile ? '24px' : screenSize.isTablet ? '28px' : '32px', marginBottom: '10px', fontWeight: 700 }}>Share Your Thoughts With Us</h1>
            <p style={{ color: isDarkTheme ? '#cbd5e1' : '#4b5563', maxWidth: screenSize.isTablet ? '600px' : '500px', lineHeight: 1.6, fontSize: screenSize.isMobile ? '14px' : '16px' }}>
              We value your opinion and strive to improve our services. Your feedback helps us serve you better.
            </p>
            <img src={contactImage} alt="Contact" style={{ maxWidth: screenSize.isTablet ? '60%' : '80%', height: 'auto', marginTop: '30px' }} />
          </div>

          {/* Right Side - Form */}
          <div style={{ flex: 1, padding: screenSize.isMobile ? '20px' : '40px', display: 'flex', justifyContent: 'center', alignItems: screenSize.isMobile ? 'flex-start' : 'center', animation: 'fadeInRight 0.8s ease' }}>
            <div style={{ width: '100%', maxWidth: screenSize.isMobile ? 'none' : '700px', background: isDarkTheme ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)', padding: '30px', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>

              <h2 style={{ fontSize: screenSize.isMobile ? '1.8rem' : screenSize.isTablet ? '2.1rem' : '2.3rem', fontWeight: 700, color: '#0d9db8', marginBottom: screenSize.isMobile ? '16px' : '20px', fontFamily: '"Merriweather", serif', textAlign: screenSize.isMobile ? 'center' : 'left' }}>Feedback Form</h2>
              <p style={{ marginBottom: '25px', color: isDarkTheme ? '#94a3b8' : '#64748b', fontSize: screenSize.isMobile ? '0.9rem' : '1rem', textAlign: screenSize.isMobile ? 'center' : 'left' }}>
                {feedbackSubmitted ? "Thanks! Your feedback helps us grow." : "Share your experience and rate our service."}
              </p>

              {feedbackSubmitted ? (
                <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid #10b981' }}>
                  <h3 style={{ color: '#10b981', marginBottom: '10px' }}>✓ Feedback Sent!</h3>
                  <p style={{ color: isDarkTheme ? '#cbd5e1' : '#334155' }}>We have received your rating and message.</p>
                  <button onClick={handleEditFeedback} style={{ marginTop: '15px', background: 'none', border: '1px solid #10b981', color: '#10b981', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Name & Email */}
                  <div style={{ display: 'flex', gap: '15px', flexDirection: screenSize.isMobile ? 'column' : 'row' }}>
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} style={getInputStyle()} required />
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} style={getInputStyle()} required />
                  </div>

                  {/* Phone & Type */}
                  <div style={{ display: 'flex', gap: '15px', flexDirection: screenSize.isMobile ? 'column' : 'row' }}>
                    <input type="tel" name="phone" placeholder="Phone (Optional)" value={formData.phone} onChange={handleInputChange} style={getInputStyle()} />
                    <select name="feedback_type" value={formData.feedback_type} onChange={handleInputChange} style={{ ...getInputStyle(), cursor: 'pointer' }} required>
                      <option value="">Feedback Type</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="compliment">Compliment</option>
                      <option value="complaint">Complaint</option>
                      <option value="bug_report">Bug Report</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="general">General Feedback</option>
                    </select>
                  </div>

                  {/* Message */}
                  <textarea name="message" placeholder="Share your detailed feedback here... Tell us about your experience, suggestions for improvement, or any issues you've encountered." value={formData.message} onChange={handleInputChange} style={{ ...getInputStyle(), minHeight: screenSize.isMobile ? '120px' : '140px', resize: 'vertical', lineHeight: 1.6, paddingTop: '20px' }} required />

                  {/* Star Rating Section */}
                  <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: isDarkTheme ? '#e2e8f0' : '#374151' }}>Rate your experience:</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={32}
                          className="star-icon"
                          fill={star <= (hoverRating || rating) ? "#fbbf24" : "transparent"}
                          color={star <= (hoverRating || rating) ? "#fbbf24" : (isDarkTheme ? "#94a3b8" : "#cbd5e1")}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    {rating > 0 && <span style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 600, marginTop: '5px', display: 'block' }}>
                      {rating === 5 ? "Excellent! 🎉" : rating === 4 ? "Very Good! 😊" : rating === 3 ? "Good 🙂" : rating === 2 ? "Fair 😐" : "Poor 😞"}
                    </span>}
                  </div>

                  <button type="submit" disabled={isSubmitting} style={getButtonStyle()}>
                    {isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}
                  </button>
                </form>
              )}

              <div style={{ marginTop: '20px', textAlign: screenSize.isMobile ? 'center' : 'left' }}>
                <Link to="/" style={{ color: isDarkTheme ? '#94a3b8' : '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Client Feedback Section */}
        <div id="client-feedback-section" style={{
          padding: '60px 20px',
          background: isDarkTheme
            ? 'linear-gradient(135deg, #1f2937, #0f172a)'
            : 'linear-gradient(135deg, #d1f4f9, #f8fdfe)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#0d9db8', fontSize: screenSize.isMobile ? '1.5rem' : '2rem', marginBottom: '10px', fontWeight: 700, fontFamily: '"Merriweather", serif' }}>Some Of Our Clients</h2>
          <h3 style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b', fontSize: screenSize.isMobile ? '1.2rem' : '1.5rem', marginBottom: '40px', fontWeight: 600, fontFamily: '"Merriweather", serif' }}>Saying About Us</h3>

          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => scrollFeedback('left')} style={{ background: '#0d9db8', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: 'white', marginRight: '10px', zIndex: 10, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease' }}>
              <ChevronLeft size={24} />
            </button>

            <div id="feedback-scroll" className="feedback-scroll-container" style={{
              display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 5px', scrollBehavior: 'smooth'
            }}>
              {feedbacks.map((feedback) => (
                <div key={feedback.id} style={feedbackCardStyle}>
                  {/* Star Rating Display */}
                  {feedback.rating && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < feedback.rating ? "#fbbf24" : "transparent"} color={i < feedback.rating ? "#fbbf24" : "#cbd5e1"} />
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '3rem', color: '#0d9db8', lineHeight: '0.5', fontFamily: 'serif', textAlign: 'left' }}>"</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0d9db8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>{feedback.name.charAt(0)}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: isDarkTheme ? '#f1f5f9' : '#1e293b' }}>{feedback.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#0d9db8', textTransform: 'capitalize' }}>{feedback.type}</div>
                    </div>
                  </div>
                  <p style={{ color: isDarkTheme ? '#cbd5e1' : '#475569', lineHeight: 1.6, textAlign: 'left', flex: 1, fontSize: '0.9rem' }}>{feedback.message}</p>

                  {feedback.reply && (
                    <div style={{ background: isDarkTheme ? 'rgba(13, 157, 184, 0.1)' : 'rgba(209, 244, 249, 0.5)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #0d9db8', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <img src={doctorXLogo} alt="DoctorX" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0d9db8' }}>{feedback.reply.from}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: isDarkTheme ? '#cbd5e1' : '#334155', margin: 0, lineHeight: 1.5 }}>{feedback.reply.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => scrollFeedback('right')} style={{ background: '#0d9db8', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: 'white', marginLeft: '10px', zIndex: 10, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease' }}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: 'fixed',
            top: screenSize.isMobile ? '10px' : '20px',
            right: screenSize.isMobile ? '10px' : '20px',
            left: screenSize.isMobile ? '10px' : 'auto',
            zIndex: 9999,
            pointerEvents: 'none'
          }}>
            <div style={{
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
              borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
              pointerEvents: 'all',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '14px',
                fontWeight: 600,
                background: toast.type === 'success' ? '#10b981' : '#ef4444',
                color: 'white'
              }}>
                {toast.type === 'success' ? '✓' : '✕'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: screenSize.isMobile ? '13px' : '14px', color: isDarkTheme ? '#f8fafc' : '#1f2937', marginBottom: '2px' }}>{toast.title}</div>
                <div style={{ fontSize: screenSize.isMobile ? '12px' : '13px', color: isDarkTheme ? '#cbd5e1' : '#6b7280', lineHeight: 1.4 }}>{toast.message}</div>
              </div>
              <button onClick={closeToast} style={{
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
                flexShrink: 0,
                fontSize: '18px'
              }}>×</button>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: toast.type === 'success' ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                borderRadius: '0 0 16px 16px',
                transformOrigin: 'left',
                animation: 'progress 6s linear forwards'
              }}></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactPage;