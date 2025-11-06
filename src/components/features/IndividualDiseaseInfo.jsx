import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Globe,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Bell,
  Activity,
  Shield,
  Heart,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Info,
  Stethoscope,
  Pill,
  BookOpen,
  BookmarkPlus,
  BookmarkCheck
} from 'lucide-react';
import { useWHOOutbreaks, useWHOSearch } from '../../hooks/useWHOApi';
import { saveDiseaseToFirebase, isDiseaseAlreadySaved, removeSavedDisease } from '../../services/firebaseService';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Helper hook for responsive design using media queries in JS
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};

const IndividualDiseasesInfo = () => {
  const { diseaseName } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Save disease states
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // State management for hover effects to simulate :hover pseudo-class
  const [hoverStates, setHoverStates] = useState({});
  const handleHover = (key, value) => {
    setHoverStates(prev => ({ ...prev, [key]: value }));
  };

  // State for focus effects
  const [focusStates, setFocusStates] = useState({});
  const handleFocus = (key, value) => {
    setFocusStates(prev => ({ ...prev, [key]: value }));
  };

  // Check for authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

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

  // WHO API hooks
  const whoOutbreaksHook = useWHOOutbreaks({ limit: 3, enableMonitoring: true, monitoringInterval: 600000 });
  const whoSearchHook = useWHOSearch(disease?.name || '', 500);

  // Safely extract values with defaults
  const { outbreaks: diseaseOutbreaks = [], loading: outbreaksLoading = false, newOutbreaks = [], hasNewOutbreaks = false, clearNewOutbreaks = () => { } } = whoOutbreaksHook || {};
  const { results: relatedWHOContent = [] } = whoSearchHook || {};

  const createSlug = useCallback((name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }, []);

  const getFallbackData = useCallback(() => [
    { id: 1, name: "COVID-19", category: "Infectious Disease", description: "A highly contagious respiratory illness caused by the SARS-CoV-2 virus.", symptoms: ["Fever", "Cough", "Shortness of breath", "Loss of taste or smell", "Fatigue"], treatment: ["Rest and hydration", "Antiviral medications", "Oxygen therapy if needed"], prevention: ["Vaccination", "Mask wearing", "Social distancing", "Hand hygiene"], severity: "Variable", duration: "1-4 weeks", contagious: true, affectedPopulation: "Global", geographicSpread: "Worldwide", onsetPeriod: "2-14 days", image: "images/diseases/covid19.jpg" },
    { id: 2, name: "Influenza", category: "Infectious Disease", description: "A contagious respiratory illness caused by influenza viruses.", symptoms: ["High fever", "Body aches", "Headache", "Cough", "Sore throat"], treatment: ["Antiviral drugs", "Rest", "Fluids", "Pain relievers"], prevention: ["Annual vaccination", "Hand washing", "Avoiding sick people"], severity: "Moderate", duration: "1-2 weeks", contagious: true, affectedPopulation: "All ages", geographicSpread: "Seasonal worldwide", onsetPeriod: "1-4 days", image: "images/diseases/influenza.jpg" },
    { id: 3, name: "Diabetes", category: "Chronic Disease", description: "A group of metabolic disorders characterized by high blood sugar levels.", symptoms: ["Increased thirst", "Frequent urination", "Extreme fatigue", "Blurred vision"], treatment: ["Insulin therapy", "Blood sugar monitoring", "Dietary management", "Exercise"], prevention: ["Healthy diet", "Regular exercise", "Weight management", "Regular checkups"], severity: "Chronic", duration: "Lifelong", contagious: false, affectedPopulation: "All ages (Type 1), Adults (Type 2)", geographicSpread: "Worldwide", onsetPeriod: "Gradual or sudden", image: "images/diseases/diabetes.jpg" }
  ], []);

  useEffect(() => {
    const loadDiseaseData = async () => {
      try {
        setLoading(true);
        setError(null);
        let diseasesData = [];
        try {
          const response = await fetch('/data/diseases.json');
          if (response.ok) diseasesData = await response.json();
          // eslint-disable-next-line no-unused-vars
        } catch (jsonError) {
          console.warn('Could not load diseases.json, using fallback data');
        }
        if (diseasesData.length === 0) diseasesData = getFallbackData();
        const foundDisease = diseasesData.find(d => createSlug(d.name) === diseaseName?.toLowerCase());
        if (foundDisease) setDisease(foundDisease);
        else setError('Disease not found');
      } catch (loadError) {
        console.error('Error loading disease data:', loadError);
        setError('Failed to load disease information');
      } finally {
        setLoading(false);
      }
    };
    if (diseaseName) loadDiseaseData();
  }, [diseaseName, createSlug, getFallbackData]);

  // Check if disease is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (disease && isAuthenticated) {
        try {
          const saved = await isDiseaseAlreadySaved(createSlug(disease.name));
          setIsSaved(saved);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkIfSaved();
  }, [disease, isAuthenticated, createSlug]);

  // Handle save/unsave disease
  const handleSaveDisease = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save diseases', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await removeSavedDisease(createSlug(disease.name));
        setIsSaved(false);
        showToast('Disease removed from saved list', 'info');
      } else {
        await saveDiseaseToFirebase({
          name: disease.name,
          slug: createSlug(disease.name),
          category: disease.category,
          description: disease.description,
          severity: disease.severity,
          contagious: disease.contagious
        });
        setIsSaved(true);
        showToast('Disease saved successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving disease:', error);
      showToast('Failed to save disease. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Theme colors based on DiseasesFront colors
  const themes = {
    light: {
      colorPrimary: '#ffffff',
      colorSecondary: '#0d9db8',
      colorThird: '#3b82f6',
      colorFourth: '#d1f4f9',
      colorDark: '#1a1a1a',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorDanger: '#dc2626',
      borderColor: 'rgba(13, 157, 184, 0.1)',
      cardBg: 'rgba(13, 157, 184, 0.02)',
      textColorSecondary: '#6b7280',
    },
    dark: {
      colorPrimary: '#121212',
      colorSecondary: '#0d9db8',
      colorThird: '#60a5fa',
      colorFourth: '#1f2937',
      colorDark: '#e5e7eb',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorDanger: '#dc2626',
      borderColor: '#374151',
      cardBg: 'rgba(13, 157, 184, 0.05)',
      textColorSecondary: '#9ca3af',
    }
  };
  const currentTheme = themes[isDarkMode ? 'dark' : 'light'];

  // Global styles and keyframes injection
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      body {
        --color-primary: ${currentTheme.colorPrimary};
        --color-secondary: ${currentTheme.colorSecondary};
        --color-third: ${currentTheme.colorThird};
        --color-fourth: ${currentTheme.colorFourth};
        --color-dark: ${currentTheme.colorDark};
      }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
      * { transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease; scrollbar-width: thin; scrollbar-color: ${currentTheme.colorSecondary} ${currentTheme.colorFourth}; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: ${currentTheme.colorFourth}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb { background: ${currentTheme.colorSecondary}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: ${currentTheme.colorThird}; }
      ::selection { background: rgba(13, 157, 184, 0.2); color: ${currentTheme.colorDark}; }
      ::-moz-selection { background: rgba(13, 157, 184, 0.2); color: ${currentTheme.colorDark}; }
      .animate-spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [isDarkMode, currentTheme]);

  // Responsive breakpoints
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobileLandscape = useMediaQuery('(max-width: 768px)');
  const isMobilePortrait = useMediaQuery('(max-width: 480px)');
  const isExtraSmall = useMediaQuery('(max-width: 360px)');

  // Merges style objects, prioritizing later arguments
  const mergeStyles = (...styles) => Object.assign({}, ...styles.filter(Boolean));

  // #region STYLES OBJECT
  const styles = {
    IndividualDiseasesInfo: {
      background: isDarkMode
        ? 'linear-gradient(135deg, #1f2937 0%, #0f172a 50%, #121212 100%)'
        : currentTheme.colorFourth,
      minHeight: '100vh',
      color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark,
      lineHeight: 1.6,
      paddingTop: '50px'
    },
    container: mergeStyles(
      { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
      isTablet && { padding: '0 20px' },
      isMobileLandscape && { padding: '0 16px' },
      isMobilePortrait && { padding: '0 12px' },
      isExtraSmall && { padding: '0 8px' }
    ),
    detailHeader: mergeStyles(
      { color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark, padding: '80px 0 40px 0', marginBottom: '40px' },
      isMobileLandscape && { padding: '60px 0 30px 0', marginBottom: '30px' },
      isMobilePortrait && { padding: '40px 0 20px 0', marginBottom: '20px' }
    ),
    headerTop: mergeStyles({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '12px' }, isMobilePortrait && { marginBottom: '20px', flexWrap: 'wrap' }),
    backButton: (isHovered, isFocused) => mergeStyles(
      {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(115, 142, 239, 0.368)',
        color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorThird,
        border: `1px solid ${isDarkMode ? 'var(--color-secondary)' : currentTheme.colorDark}`,
        padding: '10px',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textDecoration: 'none'
      },
      isHovered && { background: isDarkMode ? 'rgba(13, 157, 184, 0.3)' : 'rgba(255, 255, 255, 0.3)', transform: 'translateY(-2px)' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    saveButton: (isHovered, isFocused) => mergeStyles(
      {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: isSaved
          ? 'rgba(16, 185, 129, 0.2)'
          : isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(115, 142, 239, 0.368)',
        border: `1px solid ${isSaved ? '#10b981' : isDarkMode ? 'var(--color-secondary)' : currentTheme.colorDark}`,
        color: isSaved ? '#10b981' : isDarkMode ? 'var(--color-secondary)' : currentTheme.colorThird,
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: isSaving ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: isSaving ? 0.6 : 1,
        textDecoration: 'none',
        fontSize: '0.9rem'
      },
      isHovered && !isSaving && {
        background: isSaved
          ? 'rgba(16, 185, 129, 0.3)'
          : isDarkMode ? 'rgba(13, 157, 184, 0.3)' : 'rgba(255, 255, 255, 0.3)',
        transform: 'translateY(-2px)'
      },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' },
      isMobilePortrait && { padding: '8px 12px', fontSize: '0.85rem' }
    ),
    diseaseHeaderContent: mergeStyles(
      { display: 'flex', gap: '50px', alignItems: 'flex-start' },
      isTablet && { flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }
    ),
    diseaseImageContainer: { position: 'relative', flexShrink: 0 },
    diseaseImage: mergeStyles(
      { width: '350px', height: 'auto', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' },
      isTablet && { width: '250px', height: '170px' },
      isMobilePortrait && { width: '200px', height: '140px' },
      isExtraSmall && { width: '180px', height: '120px' }
    ),
    diseaseCategoryBadge: { position: 'absolute', top: '12px', right: '12px', background: currentTheme.colorWarning, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 },
    diseaseInfo: { flex: 1 },
    diseaseTitle: mergeStyles(
      { fontSize: '2.5rem', fontWeight: 500, color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, marginBottom: '15px', fontFamily: "'Merriweather', serif", textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
      isMobileLandscape && { fontSize: '2rem' },
      isMobilePortrait && { fontSize: '1.75rem', marginBottom: '8px' },
      isExtraSmall && { fontSize: '1.5rem' }
    ),
    diseaseSubtitle: mergeStyles(
      { fontSize: '1.1rem', opacity: 0.9, marginBottom: '20px', lineHeight: 1.6 },
      isMobileLandscape && { fontSize: '1rem' },
      isMobilePortrait && { fontSize: '0.95rem' }
    ),
    quickStats: mergeStyles(
      { display: 'flex', gap: '24px', flexWrap: 'wrap' },
      isTablet && { justifyContent: 'center' },
      isMobilePortrait && { flexDirection: 'column', gap: '12px' }
    ),
    quickStat: mergeStyles(
      {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        border: `1px solid ${isDarkMode ? 'rgba(13, 157, 184, 0.3)' : 'rgba(13, 157, 184, 0.2)'}`
      },
      isMobilePortrait && { justifyContent: 'center', padding: '10px 16px' }
    ),
    statIcon: { color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary },
    mainContent: { marginBottom: '60px' },
    contentWrapper: { display: 'flex', flexDirection: 'column', gap: '40px' },
    outbreakAlert: { background: `linear-gradient(135deg, ${currentTheme.colorDanger} 0%, #ef4444 100%)`, color: 'white', padding: '16px 24px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)' },
    alertContent: { display: 'flex', alignItems: 'center', gap: '12px' },
    alertText: { fontWeight: 600, fontSize: '1rem' },
    alertDismiss: (isHovered, isFocused) => mergeStyles(
      { background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.3s ease' },
      isHovered && { background: 'rgba(255, 255, 255, 0.3)' },
      isMobilePortrait && { padding: '4px 12px', fontSize: '0.8rem' },
      isFocused && { outline: '2px solid rgba(255, 255, 255, 0.8)', outlineOffset: '2px' }
    ),
    mainSection: { background: currentTheme.colorPrimary, borderRadius: '16px', overflow: 'hidden', boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)', border: `1px solid ${currentTheme.borderColor}` },
    diseaseTabs: mergeStyles(
      {
        display: 'flex',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        borderBottom: `1px solid ${currentTheme.borderColor}`
      },
      isMobileLandscape && { flexWrap: 'wrap' }
    ),
    tabButton: (isActive, isHovered, isFocused) => mergeStyles(
      { flex: 1, background: 'none', border: 'none', padding: '20px 16px', color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', fontSize: '0.95rem' },
      isHovered && { background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)', color: isDarkMode ? '#0d9db8' : currentTheme.colorSecondary },
      isActive && { background: currentTheme.colorPrimary, color: isDarkMode ? '#0d9db8' : currentTheme.colorSecondary, boxShadow: isDarkMode ? '0 -2px 8px rgba(0, 0, 0, 0.3)' : '0 -2px 8px rgba(0, 0, 0, 0.1)' },
      isMobileLandscape && { flex: 'none', minWidth: 'calc(50% - 1px)', fontSize: '0.85rem', padding: '16px 12px' },
      isMobilePortrait && { minWidth: '100%', padding: '14px 8px', fontSize: '0.8rem' },
      isExtraSmall && { padding: '12px 4px', fontSize: '0.75rem' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    activeTabIndicator: { content: "''", position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: isDarkMode ? `linear-gradient(90deg, var(--color-secondary), var(--color-third))` : `linear-gradient(90deg, ${currentTheme.colorSecondary}, ${currentTheme.colorThird})` },
    tabContentContainer: mergeStyles(
      { padding: '40px' },
      isMobileLandscape && { padding: '24px' },
      isMobilePortrait && { padding: '16px' }
    ),
    tabContent: { animation: 'fadeInUp 0.4s ease' },
    diseaseOverview: { display: 'flex', flexDirection: 'column', gap: '30px' },
    overviewStats: mergeStyles(
      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
      isTablet && { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
      isMobilePortrait && { gridTemplateColumns: '1fr' }
    ),
    statCard: (isHovered) => mergeStyles(
      {
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${currentTheme.borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && { transform: 'translateY(-2px)', boxShadow: isDarkMode ? '0 6px 20px rgba(0, 0, 0, 0.3)' : '0 6px 20px rgba(0, 0, 0, 0.1)' },
      isMobilePortrait && { padding: '16px', flexDirection: 'column', textAlign: 'center' },
      isExtraSmall && { padding: '12px' }
    ),
    statCardIconContainer: { background: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, color: 'white', padding: '12px', borderRadius: '8px', flexShrink: 0 },
    statContent: {},
    statContentHeader: { margin: '0 0 4px 0', fontSize: '0.9rem', color: isDarkMode ? 'var(--color-dark)' : '#6b7280', fontWeight: 600 },
    statContentP: { margin: 0, fontSize: '1.1rem', fontWeight: 700, color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark },
    descriptionSection: mergeStyles(
      {
        background: isDarkMode ? 'rgba(13, 157, 184, 0.1)' : currentTheme.cardBg,
        padding: '30px',
        borderRadius: '12px',
        borderLeft: `4px solid ${isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary}`
      },
      isMobilePortrait && { padding: '20px' }
    ),
    sectionHeading: { display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', fontSize: '1.3rem', color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, fontWeight: 700 },
    detailedDescription: { fontSize: '1.05rem', lineHeight: 1.7, color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark, marginBottom: '16px' },
    additionalInfo: { background: isDarkMode ? 'rgba(13, 157, 184, 0.1)' : currentTheme.colorFourth, padding: '16px', borderRadius: '8px', borderLeft: `3px solid ${isDarkMode ? 'var(--color-third)' : currentTheme.colorThird}` },
    additionalInfoP: { margin: 0, fontStyle: 'italic', color: isDarkMode ? 'var(--color-dark)' : '#4a5568' },
    symptomsSection: {},
    symptomsGrid: mergeStyles(
      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '30px' },
      isMobileLandscape && { gridTemplateColumns: '1fr' }
    ),
    symptomItem: (isHovered) => mergeStyles(
      {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        borderRadius: '8px',
        border: `1px solid ${currentTheme.borderColor}`,
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && {
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
        transform: 'translateX(4px)'
      }
    ),
    symptomCheck: { color: currentTheme.colorSuccess, flexShrink: 0 },
    symptomText: { fontWeight: 500, color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark },
    stagesSection: { marginTop: '40px' },
    stagesSectionHeader: { fontSize: '1.1rem', color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, marginBottom: '20px', fontWeight: 700 },
    stagesList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    stageItem: mergeStyles(
      { display: 'flex', gap: '16px', padding: '20px', background: currentTheme.colorPrimary, borderRadius: '12px', border: `1px solid ${currentTheme.borderColor}`, boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)', willChange: 'transform, box-shadow' },
      isMobilePortrait && { padding: '16px', flexDirection: 'column', gap: '12px' }
    ),
    stageNumber: { background: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 },
    stageContent: {},
    stageContentHeader: { margin: '0 0 8px 0', fontSize: '1.1rem', color: currentTheme.colorDark, fontWeight: 700 },
    stageContentP: { margin: 0, color: currentTheme.textColorSecondary, lineHeight: 1.6 },
    treatmentGrid: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' },
    treatmentItem: (isHovered) => mergeStyles(
      {
        padding: '24px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.borderColor}`,
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && {
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
        transform: 'translateY(-2px)'
      },
      isMobilePortrait && { padding: '16px' }
    ),
    treatmentHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    treatmentIcon: { color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary },
    treatmentType: { fontWeight: 700, color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, fontSize: '0.9rem' },
    treatmentText: { margin: 0, lineHeight: 1.6, color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark },
    medicationsSection: { marginTop: '40px' },
    medicationsList: mergeStyles(
      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' },
      isMobileLandscape && { gridTemplateColumns: '1fr' }
    ),
    medicationItem: { padding: '20px', background: currentTheme.colorPrimary, borderRadius: '12px', border: `1px solid ${currentTheme.borderColor}`, boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)', willChange: 'transform, box-shadow' },
    medicationName: { display: 'block', color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, fontSize: '1.1rem', marginBottom: '4px' },
    dosage: { display: 'inline-block', background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : currentTheme.colorFourth, color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' },
    medDescription: { margin: '8px 0 0 0', color: currentTheme.textColorSecondary, fontSize: '0.9rem', lineHeight: 1.5 },
    preventionGrid: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' },
    preventionItem: (isHovered) => mergeStyles(
      {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '20px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.borderColor}`,
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && {
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
        transform: 'translateX(4px)'
      },
      isMobilePortrait && { padding: '16px', flexDirection: 'column', gap: '12px' }
    ),
    preventionIcon: { color: currentTheme.colorSuccess, flexShrink: 0, marginTop: '2px' },
    preventionText: { margin: 0, lineHeight: 1.6, color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark },
    vaccineSection: mergeStyles(
      {
        marginTop: '40px',
        padding: '24px',
        background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
        borderRadius: '12px',
        borderLeft: `4px solid ${currentTheme.colorSuccess}`
      },
      isMobilePortrait && { padding: '20px' }
    ),
    vaccineSectionHeader: { fontSize: '1.1rem', color: currentTheme.colorSuccess, marginBottom: '16px', fontWeight: 700 },
    vaccineInfo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' },
    vaccineInfoP: { margin: 0, padding: '8px 0', borderBottom: isDarkMode ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.1)', fontSize: '0.9rem' },
    vaccineInfoPStrong: { color: currentTheme.colorSuccess },
    noData: { textAlign: 'center', color: currentTheme.textColorSecondary, fontStyle: 'italic', padding: '40px', background: isDarkMode ? 'rgba(13, 157, 184, 0.1)' : currentTheme.colorFourth, borderRadius: '12px', border: `2px dashed ${isDarkMode ? '#374151' : '#d1d5db'}` },
    relatedWhoContent: mergeStyles(
      { background: currentTheme.colorPrimary, padding: '40px', borderRadius: '16px', boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)', border: `1px solid ${currentTheme.borderColor}` },
      isMobileLandscape && { padding: '24px' },
      isMobilePortrait && { padding: '16px' },
      isExtraSmall && { padding: '12px' }
    ),
    sectionTitle: mergeStyles(
      { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark, marginBottom: '24px', fontFamily: "'Merriweather', serif" },
      isMobileLandscape && { fontSize: '1.3rem' },
      isMobilePortrait && { fontSize: '1.2rem', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }
    ),
    sectionTitleAfter: mergeStyles(
      { content: "''", flex: 1, height: '2px', background: isDarkMode ? `linear-gradient(90deg, var(--color-secondary), transparent)` : `linear-gradient(90deg, ${currentTheme.colorSecondary}, transparent)`, marginLeft: '16px' },
      isMobileLandscape && { marginLeft: '12px' },
      isMobilePortrait && { width: '100%', marginLeft: 0 }
    ),
    whoContentList: mergeStyles(
      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
      isTablet && { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' },
      isMobileLandscape && { gridTemplateColumns: '1fr' }
    ),
    whoContentItem: (isHovered) => mergeStyles(
      {
        display: 'flex',
        gap: '16px',
        padding: '20px',
        borderRadius: '12px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        border: `1px solid ${currentTheme.borderColor}`,
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && {
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
        borderColor: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary,
        transform: 'translateY(-2px)'
      },
      isMobilePortrait && { padding: '16px', flexDirection: 'column', gap: '12px' },
      isExtraSmall && { padding: '12px' }
    ),
    contentIcon: { color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, flexShrink: 0, marginTop: '4px' },
    contentDetails: { flex: 1, minWidth: 0 },
    contentDetailsHeader: { margin: '0 0 8px 0', fontSize: '0.95rem', lineHeight: 1.4 },
    contentLink: (isHovered, isFocused) => mergeStyles(
      { background: 'none', border: 'none', color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark, textAlign: 'left', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px' },
      isHovered && { color: isDarkMode ? '#0d9db8' : currentTheme.colorSecondary, textDecoration: 'underline' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    contentDate: { fontSize: '0.8rem', color: currentTheme.textColorSecondary, fontWeight: 500 },
    contentSummary: { margin: '8px 0 0 0', fontSize: '0.85rem', color: currentTheme.textColorSecondary, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, lineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    diseaseOutbreaksSection: { background: currentTheme.colorPrimary, padding: '40px', borderRadius: '16px', boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)', border: `1px solid rgba(220, 38, 38, 0.2)` },
    outbreakTitle: { color: `${currentTheme.colorDanger} !important` },
    outbreaksList: mergeStyles({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }, isTablet && { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }, isMobileLandscape && { gridTemplateColumns: '1fr' }),
    outbreakItem: (isHovered) => mergeStyles(
      { display: 'flex', gap: '16px', padding: '20px', borderRadius: '12px', background: isDarkMode ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)', borderLeft: `4px solid ${currentTheme.colorDanger}`, transition: 'all 0.3s ease', willChange: 'transform, box-shadow' },
      isHovered && { background: isDarkMode ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.1)', transform: 'translateY(-2px)' }
    ),
    outbreakIcon: { color: currentTheme.colorDanger, flexShrink: 0, marginTop: '4px' },
    outbreakContent: { flex: 1, minWidth: 0 },
    outbreakContentHeader: { margin: '0 0 8px 0', fontSize: '1rem', lineHeight: 1.4 },
    outbreakLink: (isHovered, isFocused) => mergeStyles(
      { background: 'none', border: 'none', color: currentTheme.colorDanger, textAlign: 'left', cursor: 'pointer', textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px' },
      isHovered && { textDecoration: 'underline', color: '#b91c1c' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    whoUpdatesSection: { background: currentTheme.colorPrimary, padding: '40px', borderRadius: '16px', boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)', border: `1px solid ${currentTheme.borderColor}` },
    sectionHeader: mergeStyles(
      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
      isMobileLandscape && { flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }
    ),
    refreshButton: (isHovered, isFocused) => mergeStyles(
      { display: 'flex', alignItems: 'center', gap: '8px', background: isDarkMode ? `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-third) 100%)` : `linear-gradient(135deg, ${currentTheme.colorSecondary} 0%, ${currentTheme.colorThird} 100%)`, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.9rem' },
      isHovered && { transform: 'translateY(-2px)', boxShadow: isDarkMode ? '0 4px 12px rgba(13, 157, 184, 0.4)' : '0 4px 12px rgba(13, 157, 184, 0.3)' },
      isMobilePortrait && { padding: '8px 12px', fontSize: '0.8rem' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    refreshButtonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
    updateItem: (isHovered) => mergeStyles(
      {
        display: 'flex',
        gap: '16px',
        padding: '20px',
        borderRadius: '12px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        border: `1px solid ${currentTheme.borderColor}`,
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && {
        background: isDarkMode ? 'rgba(13, 157, 184, 0.2)' : 'rgba(13, 157, 184, 0.1)',
        borderColor: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary,
        transform: 'translateY(-2px)'
      }
    ),
    updateCategory: { display: 'inline-block', fontSize: '0.75rem', background: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, color: 'white', padding: '4px 8px', borderRadius: '12px', marginTop: '8px', fontWeight: 600 },
    updateCategoryEmergency: { background: currentTheme.colorDanger },
    whoResourcesSection: { background: currentTheme.colorPrimary, padding: '40px', borderRadius: '16px', boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)', border: `1px solid ${currentTheme.borderColor}`, marginBottom: '50px' },
    resourcesGrid: mergeStyles(
      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
      isTablet && { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
      isMobileLandscape && { gridTemplateColumns: '1fr' }
    ),
    resourceCard: (isHovered) => mergeStyles(
      {
        padding: '24px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)'
          : currentTheme.colorFourth,
        borderRadius: '12px',
        textAlign: 'center',
        border: `1px solid ${currentTheme.borderColor}`,
        transition: 'all 0.3s ease',
        willChange: 'transform, box-shadow'
      },
      isHovered && {
        transform: 'translateY(-4px)',
        boxShadow: isDarkMode ? '0 8px 25px rgba(0, 0, 0, 0.3)' : '0 8px 25px rgba(0, 0, 0, 0.1)',
        background: isDarkMode ? 'rgba(13, 157, 184, 0.1)' : 'rgba(13, 157, 184, 0.05)'
      },
      isMobilePortrait && { padding: '20px' },
      isExtraSmall && { padding: '12px' }
    ),
    resourceCardIcon: { color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, marginBottom: '12px' },
    resourceCardHeader: { margin: '0 0 8px 0', fontSize: '1rem', color: isDarkMode ? '#e5e7eb' : currentTheme.colorDark, fontWeight: 700 },
    resourceCardP: { margin: '0 0 16px 0', fontSize: '0.9rem', color: currentTheme.textColorSecondary, lineHeight: 1.4 },
    resourceLink: (isHovered, isFocused) => mergeStyles(
      { background: 'none', border: 'none', color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' },
      isHovered && { color: isDarkMode ? 'var(--color-third)' : currentTheme.colorThird, textDecoration: 'underline', transform: 'translateX(4px)' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    loadingState: { textAlign: 'center', padding: '60px 20px' },
    loadingText: { fontSize: '1.2rem', color: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, animation: 'pulse 2s infinite' },
    errorState: { textAlign: 'center', padding: '60px 20px', color: currentTheme.colorDanger },
    errorStateHeader: { color: currentTheme.colorDark, marginBottom: '16px', fontSize: '1.8rem' },
    errorStateP: { marginBottom: '24px', lineHeight: 1.6 },
    retryButton: (isHovered, isFocused) => mergeStyles(
      { padding: '12px 24px', background: isDarkMode ? 'var(--color-secondary)' : currentTheme.colorSecondary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' },
      isHovered && { background: isDarkMode ? 'var(--color-third)' : currentTheme.colorThird, transform: 'translateY(-2px)' },
      isFocused && { outline: `2px solid ${currentTheme.colorSecondary}`, outlineOffset: '2px' }
    ),
    toastContainer: {
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 10000,
      pointerEvents: 'none'
    },
    toast: (show, type) => {
      const baseStyle = {
        display: show ? 'flex' : 'none',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.15)',
        fontSize: '0.95rem',
        fontWeight: 600,
        minWidth: '280px',
        maxWidth: '400px',
        pointerEvents: 'all',
        animation: show ? 'slideInRight 0.4s ease-out forwards' : 'none'
      };

      const typeStyles = {
        success: {
          background: isDarkMode
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        error: {
          background: isDarkMode
            ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
            : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        info: {
          background: isDarkMode
            ? 'linear-gradient(135deg, #0d9db8 0%, #0284c7 100%)'
            : 'linear-gradient(135deg, #0d9db8 0%, #0ea5e9 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      };

      const responsiveStyles = isMobilePortrait ? {
        minWidth: '250px',
        padding: '14px 20px',
        fontSize: '0.9rem',
        right: '10px'
      } : {};

      return Object.assign({}, baseStyle, typeStyles[type] || {}, responsiveStyles);
    },
    toastIcon: {
      flexShrink: 0
    },
    toastMessage: {
      flex: 1,
      lineHeight: 1.4
    }
  };
  // #endregion

  const handleBack = () => navigate(-1);
  const handleUpdateClick = (update) => {
    if (update?.url) window.open(update.url, '_blank', 'noopener,noreferrer');
  };

  const getIconComponent = (iconName, size = 20) => ({
    AlertCircle: <AlertCircle size={size} />, TrendingUp: <TrendingUp size={size} />, Globe: <Globe size={size} />,
    Calendar: <Calendar size={size} />, Shield: <Shield size={size} />, Activity: <Activity size={size} />
  })[iconName] || <Activity size={size} />;

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'emergency alert': return getIconComponent('AlertCircle');
      case 'health data': return getIconComponent('TrendingUp');
      case 'guidelines': return getIconComponent('Shield');
      default: return getIconComponent('Activity');
    }
  };

  const renderTabContent = () => {
    if (!disease) return null;
    const commonSectionHeadingStyle = mergeStyles(styles.sectionHeading, { marginBottom: '24px' });

    switch (activeTab) {
      case 'overview': return (
        <div style={styles.tabContent}>
          <div style={styles.diseaseOverview}>
            <div style={styles.overviewStats}>
              <div style={styles.statCard(hoverStates.statCard1)} onMouseEnter={() => handleHover('statCard1', true)} onMouseLeave={() => handleHover('statCard1', false)}>
                <div style={styles.statCardIconContainer}><Users size={24} /></div>
                <div style={styles.statContent}><h4 style={styles.statContentHeader}>Affected Population</h4><p style={styles.statContentP}>{disease.affectedPopulation || 'Global concern'}</p></div>
              </div>
              <div style={styles.statCard(hoverStates.statCard2)} onMouseEnter={() => handleHover('statCard2', true)} onMouseLeave={() => handleHover('statCard2', false)}>
                <div style={styles.statCardIconContainer}><MapPin size={24} /></div>
                <div style={styles.statContent}><h4 style={styles.statContentHeader}>Geographic Spread</h4><p style={styles.statContentP}>{disease.geographicSpread || 'Worldwide'}</p></div>
              </div>
              <div style={styles.statCard(hoverStates.statCard3)} onMouseEnter={() => handleHover('statCard3', true)} onMouseLeave={() => handleHover('statCard3', false)}>
                <div style={styles.statCardIconContainer}><Clock size={24} /></div>
                <div style={styles.statContent}><h4 style={styles.statContentHeader}>Onset Period</h4><p style={styles.statContentP}>{disease.onsetPeriod || 'Varies'}</p></div>
              </div>
            </div>
            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionHeading}><Info size={20} /> About {disease.name}</h3>
              <p style={styles.detailedDescription}>{disease.description}</p>
              {disease.additionalInfo && <div style={styles.additionalInfo}><p style={styles.additionalInfoP}>{disease.additionalInfo}</p></div>}
            </div>
          </div>
        </div>
      );
      case 'symptoms': return (
        <div style={styles.tabContent}>
          <div className="symptoms-section">
            <h3 style={commonSectionHeadingStyle}><Stethoscope size={20} /> Symptoms & Signs</h3>
            {disease.symptoms?.length > 0 ? (
              <div style={styles.symptomsGrid}>
                {disease.symptoms.map((symptom, index) => (
                  <div key={index} style={styles.symptomItem(hoverStates[`symptom${index}`])} onMouseEnter={() => handleHover(`symptom${index}`, true)} onMouseLeave={() => handleHover(`symptom${index}`, false)}>
                    <CheckCircle size={16} style={styles.symptomCheck} />
                    <span style={styles.symptomText}>{symptom}</span>
                  </div>
                ))}
              </div>
            ) : <p style={styles.noData}>No specific symptoms information available.</p>}
            {disease.stages && (
              <div style={styles.stagesSection}>
                <h4 style={styles.stagesSectionHeader}>Disease Stages</h4>
                <div style={styles.stagesList}>
                  {disease.stages.map((stage, index) => (
                    <div key={index} style={styles.stageItem}>
                      <div style={styles.stageNumber}>{index + 1}</div>
                      <div style={styles.stageContent}><h5 style={styles.stageContentHeader}>{stage.name}</h5><p style={styles.stageContentP}>{stage.description}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
      case 'treatment': return (
        <div style={styles.tabContent}>
          <div>
            <h3 style={commonSectionHeadingStyle}><Pill size={20} /> Treatment & Management</h3>
            {disease.treatment?.length > 0 ? (
              <div style={styles.treatmentGrid}>
                {disease.treatment.map((treatment, index) => (
                  <div key={index} style={styles.treatmentItem(hoverStates[`treatment${index}`])} onMouseEnter={() => handleHover(`treatment${index}`, true)} onMouseLeave={() => handleHover(`treatment${index}`, false)}>
                    <div style={styles.treatmentHeader}><Pill size={16} style={styles.treatmentIcon} /><span style={styles.treatmentType}>Treatment Option {index + 1}</span></div>
                    <p style={styles.treatmentText}>{treatment}</p>
                  </div>
                ))}
              </div>
            ) : <p style={styles.noData}>No specific treatment information available.</p>}
            {disease.medications && (
              <div style={styles.medicationsSection}>
                <h4 style={styles.stagesSectionHeader}>Common Medications</h4>
                <div style={styles.medicationsList}>
                  {disease.medications.map((med, index) => (
                    <div key={index} style={styles.medicationItem}>
                      <strong style={styles.medicationName}>{med.name}</strong>
                      <span style={styles.dosage}>{med.dosage}</span>
                      <p style={styles.medDescription}>{med.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
      case 'prevention': return (
        <div style={styles.tabContent}>
          <div>
            <h3 style={commonSectionHeadingStyle}><Shield size={20} /> Prevention & Control</h3>
            {disease.prevention?.length > 0 ? (
              <div style={styles.preventionGrid}>
                {disease.prevention.map((item, index) => (
                  <div key={index} style={styles.preventionItem(hoverStates[`prev${index}`])} onMouseEnter={() => handleHover(`prev${index}`, true)} onMouseLeave={() => handleHover(`prev${index}`, false)}>
                    <Shield size={16} style={styles.preventionIcon} /><p style={styles.preventionText}>{item}</p>
                  </div>
                ))}
              </div>
            ) : <p style={styles.noData}>No specific prevention information available.</p>}
            {disease.vaccineInfo && (
              <div style={styles.vaccineSection}>
                <h4 style={styles.vaccineSectionHeader}>Vaccination Information</h4>
                <div style={styles.vaccineInfo}>
                  <p style={styles.vaccineInfoP}><strong style={styles.vaccineInfoPStrong}>Available:</strong> {disease.vaccineInfo.available ? 'Yes' : 'No'}</p>
                  {disease.vaccineInfo.name && <p style={styles.vaccineInfoP}><strong style={styles.vaccineInfoPStrong}>Vaccine:</strong> {disease.vaccineInfo.name}</p>}
                  {disease.vaccineInfo.schedule && <p style={styles.vaccineInfoP}><strong style={styles.vaccineInfoPStrong}>Schedule:</strong> {disease.vaccineInfo.schedule}</p>}
                  {disease.vaccineInfo.effectiveness && <p style={styles.vaccineInfoP}><strong style={styles.vaccineInfoPStrong}>Effectiveness:</strong> {disease.vaccineInfo.effectiveness}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      );
      default: return null;
    }
  };

  if (loading) return (
    <div style={styles.IndividualDiseasesInfo}><div style={styles.container}><div style={styles.loadingState}><div style={styles.loadingText}>Loading disease information...</div></div></div></div>
  );

  if (error || !disease) return (
    <div style={styles.IndividualDiseasesInfo}>
      <div style={styles.container}>
        <div style={styles.errorState}>
          <h2 style={styles.errorStateHeader}>Disease Not Found</h2>
          <p style={styles.errorStateP}>{error || 'The requested disease information could not be found.'}</p>
          <button
            onClick={handleBack}
            style={styles.backButton(hoverStates.errorBack, focusStates.errorBack)}
            onMouseEnter={() => handleHover('errorBack', true)} onMouseLeave={() => handleHover('errorBack', false)}
            onFocus={() => handleFocus('errorBack', true)} onBlur={() => handleFocus('errorBack', false)}
          >
            <ArrowLeft size={20} />Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.IndividualDiseasesInfo}>
      {/* Toast Notification */}
      <div style={styles.toastContainer}>
        {toast.show && (
          <div style={styles.toast(toast.show, toast.type)}>
            <div style={styles.toastIcon}>
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <div style={styles.toastMessage}>{toast.message}</div>
          </div>
        )}
      </div>

      <header style={styles.detailHeader}>
        <div style={styles.container}>
          <div style={styles.headerTop}>
            <button
              onClick={handleBack}
              style={styles.backButton(hoverStates.backBtn, focusStates.backBtn)}
              onMouseEnter={() => handleHover('backBtn', true)}
              onMouseLeave={() => handleHover('backBtn', false)}
              onFocus={() => handleFocus('backBtn', true)}
              onBlur={() => handleFocus('backBtn', false)}
            >
              <ArrowLeft size={20} />
            </button>

            {/* Save Disease Button */}
            {isAuthenticated && (
              <button
                onClick={handleSaveDisease}
                disabled={isSaving}
                style={styles.saveButton(hoverStates.saveBtn, focusStates.saveBtn)}
                onMouseEnter={() => handleHover('saveBtn', true)}
                onMouseLeave={() => handleHover('saveBtn', false)}
                onFocus={() => handleFocus('saveBtn', true)}
                onBlur={() => handleFocus('saveBtn', false)}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>{isSaved ? 'Removing...' : 'Saving...'}</span>
                  </>
                ) : isSaved ? (
                  <>
                    <BookmarkCheck size={16} />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={16} />
                    <span>Save Disease</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div style={styles.diseaseHeaderContent}>
            <div style={styles.diseaseImageContainer}>
              <img
                src={disease.image ? `/${disease.image}` : '/images/diseases/default.jpg'}
                alt={disease.name}
                style={styles.diseaseImage}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop';
                }}
              />
              <div style={styles.diseaseCategoryBadge}>{disease.category}</div>
            </div>
            <div style={styles.diseaseInfo}>
              <h1 style={styles.diseaseTitle}>{disease.name}</h1>
              <p style={styles.diseaseSubtitle}>{disease.description}</p>
              <div style={styles.quickStats}>
                <div style={styles.quickStat}><Heart style={styles.statIcon} size={16} /><span>Severity: {disease.severity || 'Moderate'}</span></div>
                <div style={styles.quickStat}><Clock style={styles.statIcon} size={16} /><span>Duration: {disease.duration || 'Variable'}</span></div>
                <div style={styles.quickStat}><Users style={styles.statIcon} size={16} /><span>Contagious: {disease.contagious ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div style={mergeStyles(styles.container, styles.mainContent)}>
        {hasNewOutbreaks && (
          <div style={styles.outbreakAlert}>
            <div style={styles.alertContent}><Bell size={20} /><span style={styles.alertText}>{newOutbreaks.length} New Disease Outbreak Alert{newOutbreaks.length > 1 ? 's' : ''}</span></div>
            <button onClick={clearNewOutbreaks} style={styles.alertDismiss(hoverStates.dismiss, focusStates.dismiss)} onMouseEnter={() => handleHover('dismiss', true)} onMouseLeave={() => handleHover('dismiss', false)} onFocus={() => handleFocus('dismiss', true)} onBlur={() => handleFocus('dismiss', false)}>Dismiss</button>
          </div>
        )}
        <div style={styles.contentWrapper}>
          <main style={styles.mainSection}>
            <nav style={styles.diseaseTabs}>
              {['overview', 'symptoms', 'treatment', 'prevention'].map((tab, i) => (
                <button key={tab}
                  style={styles.tabButton(activeTab === tab, hoverStates[`tab${i}`], focusStates[`tab${i}`])}
                  onClick={() => setActiveTab(tab)}
                  onMouseEnter={() => handleHover(`tab${i}`, true)} onMouseLeave={() => handleHover(`tab${i}`, false)}
                  onFocus={() => handleFocus(`tab${i}`, true)} onBlur={() => handleFocus(`tab${i}`, false)}>
                  {{ overview: <Info size={16} />, symptoms: <Stethoscope size={16} />, treatment: <Pill size={16} />, prevention: <Shield size={16} /> }[tab]}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && <div style={styles.activeTabIndicator}></div>}
                </button>
              ))}
            </nav>
            <div style={styles.tabContentContainer}>{renderTabContent()}</div>
          </main>

          {relatedWHOContent.length > 0 && (
            <section style={styles.relatedWhoContent}>
              <h2 style={styles.sectionTitle}><Globe size={24} />Related WHO Information<span style={styles.sectionTitleAfter}></span></h2>
              <div style={styles.whoContentList}>
                {relatedWHOContent.slice(0, 4).map((content, index) => (
                  <article key={index} style={styles.whoContentItem(hoverStates[`who${index}`])} onMouseEnter={() => handleHover(`who${index}`, true)} onMouseLeave={() => handleHover(`who${index}`, false)}>
                    <div style={styles.contentIcon}>{getCategoryIcon(content.category)}</div>
                    <div style={styles.contentDetails}>
                      <h4 style={styles.contentDetailsHeader}>
                        <button onClick={() => handleUpdateClick(content)} style={styles.contentLink(hoverStates[`wholink${index}`], focusStates[`wholink${index}`])} onMouseEnter={() => handleHover(`wholink${index}`, true)} onMouseLeave={() => handleHover(`wholink${index}`, false)} onFocus={() => handleFocus(`wholink${index}`, true)} onBlur={() => handleFocus(`wholink${index}`, false)}>
                          {content.title}<ExternalLink size={14} />
                        </button>
                      </h4>
                      <time style={styles.contentDate}>{content.date}</time>
                      {content.summary && <p style={styles.contentSummary}>{content.summary}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!outbreaksLoading && diseaseOutbreaks.length > 0 && (
            <section style={mergeStyles(styles.relatedWhoContent, styles.diseaseOutbreaksSection)}>
              <h2 style={mergeStyles(styles.sectionTitle, styles.outbreakTitle)}><Globe size={24} />Latest WHO Health Updates<span style={styles.sectionTitleAfter}></span></h2>
              <div style={styles.outbreaksList}>
                {diseaseOutbreaks.map((outbreak, index) => (
                  <article key={outbreak.id} style={styles.outbreakItem(hoverStates[`outbreak${index}`])} onMouseEnter={() => handleHover(`outbreak${index}`, true)} onMouseLeave={() => handleHover(`outbreak${index}`, false)}>
                    <div style={styles.outbreakIcon}><Globe size={20} /></div>
                    <div style={styles.outbreakContent}>
                      <h3 style={styles.outbreakContentHeader}>
                        <button onClick={() => handleUpdateClick(outbreak)} style={styles.outbreakLink(hoverStates[`outbreaklink${index}`], focusStates[`outbreaklink${index}`])} onMouseEnter={() => handleHover(`outbreaklink${index}`, true)} onMouseLeave={() => handleHover(`outbreaklink${index}`, false)} onFocus={() => handleFocus(`outbreaklink${index}`, true)} onBlur={() => handleFocus(`outbreaklink${index}`, false)}>
                          {outbreak.title}{outbreak.url && <ExternalLink size={14} />}
                        </button>
                      </h3>
                      <time style={styles.contentDate}>{outbreak.date}</time>
                      {outbreak.summary && <p style={styles.contentSummary}>{outbreak.summary}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section style={mergeStyles(styles.relatedWhoContent, styles.whoResourcesSection)}>
            <h2 style={styles.sectionTitle}>WHO Resources & Tools<span style={styles.sectionTitleAfter}></span></h2>
            <div style={styles.resourcesGrid}>
              {[
                { icon: Globe, title: "Global Health Observatory", desc: "Health statistics and data", link: "https://www.who.int/data/gho", label: "Visit GHO" },
                { icon: Shield, title: "Health Topics", desc: "A-Z health topics", link: "https://www.who.int/health-topics", label: "Browse Topics" },
                { icon: TrendingUp, title: "Disease Surveillance", desc: "Outbreak monitoring", link: "https://www.who.int/emergencies/surveillance", label: "View Surveillance" },
                { icon: BookOpen, title: "Publications", desc: "Guidelines & reports", link: "https://www.who.int/publications", label: "View Publications" }
              ].map((res, index) => {
                const Icon = res.icon;
                return (
                  <div key={index} style={styles.resourceCard(hoverStates[`res${index}`])} onMouseEnter={() => handleHover(`res${index}`, true)} onMouseLeave={() => handleHover(`res${index}`, false)}>
                    <Icon size={32} style={styles.resourceCardIcon} />
                    <h4 style={styles.resourceCardHeader}>{res.title}</h4>
                    <p style={styles.resourceCardP}>{res.desc}</p>
                    <button onClick={() => window.open(res.link, '_blank')} style={styles.resourceLink(hoverStates[`reslink${index}`], focusStates[`reslink${index}`])} onMouseEnter={() => handleHover(`reslink${index}`, true)} onMouseLeave={() => handleHover(`reslink${index}`, false)} onFocus={() => handleFocus(`reslink${index}`, true)} onBlur={() => handleFocus(`reslink${index}`, false)}>
                      {res.label} &rarr;
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IndividualDiseasesInfo;