import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  BookmarkCheck,
  Activity,
  Trash2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Heart,
  Calendar
} from 'lucide-react';
import {
  getSavedDiseases,
  getAssessmentHistory,
  removeSavedDisease,
  deleteAssessment,
  getAssessmentStats
} from '../services/firebaseService';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assessments');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Data states
  const [savedDiseases, setSavedDiseases] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState(null);

  // Check authentication and theme
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        navigate('/login');
      }
    });

    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [navigate]);

  // Load data
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [diseasesData, assessmentsData, statsData] = await Promise.all([
        getSavedDiseases(),
        getAssessmentHistory(),
        getAssessmentStats()
      ]);
      setSavedDiseases(diseasesData);
      setAssessments(assessmentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDisease = async (diseaseId) => {
    if (!confirm('Remove this disease from your saved list?')) return;

    try {
      await removeSavedDisease(diseaseId);
      setSavedDiseases(prev => prev.filter(d => d.id !== diseaseId));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Failed to remove disease');
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!confirm('Delete this assessment from your history?')) return;

    try {
      await deleteAssessment(assessmentId);
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
      loadAllData(); // Refresh stats
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Failed to delete assessment');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTriageColor = (level) => {
    const colors = {
      'emergency': '#dc2626',
      'emergency_ambulance': '#b91c1c',
      'consultation_6': '#f59e0b',
      'consultation_24': '#fbbf24',
      'consultation': '#10b981',
      'self_care': '#6366f1',
      'no_action': '#8b5cf6'
    };
    return colors[level] || '#6b7280';
  };

  const getTriageLabel = (level) => {
    const labels = {
      'emergency': 'Emergency',
      'emergency_ambulance': 'Call 102',
      'consultation_6': 'See Doctor (6hrs)',
      'consultation_24': 'See Doctor (24hrs)',
      'consultation': 'Doctor Visit',
      'self_care': 'Self Care',
      'no_action': 'No Action'
    };
    return labels[level] || level;
  };

  const styles = {
    container: {
      marginTop: '20px',
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(135deg, #1f2937 0%, #0f172a 50%, #121212 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #f8fdfe 50%, #ffffff 100%)',
      paddingTop: '80px',
      paddingBottom: '40px'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    header: {
      marginBottom: '30px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: isDarkMode ? '#e5e7eb' : '#1a1a1a',
      marginBottom: '8px',
      fontFamily: "'Merriweather', serif"
    },
    subtitle: {
      fontSize: '1.1rem',
      color: isDarkMode ? '#9ca3af' : '#6b7280'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: isDarkMode
        ? 'rgba(31, 41, 55, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      backdropFilter: 'blur(10px)'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'rgba(13, 157, 184, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      color: '#0d9db8'
    },
    statLabel: {
      fontSize: '0.9rem',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '4px'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 700,
      color: isDarkMode ? '#e5e7eb' : '#1a1a1a'
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      background: isDarkMode
        ? 'rgba(31, 41, 55, 0.6)'
        : 'rgba(255, 255, 255, 0.6)',
      padding: '8px',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)'
    },
    tab: (isActive) => ({
      flex: 1,
      padding: '12px 24px',
      background: isActive
        ? isDarkMode ? '#0d9db8' : '#0d9db8'
        : 'transparent',
      color: isActive ? '#ffffff' : isDarkMode ? '#e5e7eb' : '#1a1a1a',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }),
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: isDarkMode
        ? 'rgba(31, 41, 55, 0.6)'
        : 'rgba(255, 255, 255, 0.6)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)'
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '16px',
      opacity: 0.5
    },
    emptyText: {
      fontSize: '1.2rem',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    card: {
      background: isDarkMode
        ? 'rgba(31, 41, 55, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: isDarkMode ? '#e5e7eb' : '#1a1a1a',
      marginBottom: '4px'
    },
    cardMeta: {
      fontSize: '0.85rem',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    badge: (color) => ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: 600,
      background: `${color}20`,
      color: color,
      border: `1px solid ${color}40`
    }),
    deleteBtn: {
      background: 'none',
      border: 'none',
      color: '#dc2626',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    },
    conditionsList: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
    },
    conditionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      fontSize: '0.9rem',
      color: isDarkMode ? '#e5e7eb' : '#1a1a1a'
    },
    symptomChip: {
      display: 'inline-block',
      padding: '4px 10px',
      margin: '4px 4px 4px 0',
      background: 'rgba(13, 157, 184, 0.1)',
      color: '#0d9db8',
      borderRadius: '8px',
      fontSize: '0.85rem',
      border: '1px solid rgba(13, 157, 184, 0.2)'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite', color: '#0d9db8' }} />
            <p style={{ marginTop: '16px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Loading your history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Health History</h1>
          <p style={styles.subtitle}>Track your saved diseases and assessment history</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Activity size={24} />
              </div>
              <div style={styles.statLabel}>Total Assessments</div>
              <div style={styles.statValue}>{stats.totalAssessments}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <BookmarkCheck size={24} />
              </div>
              <div style={styles.statLabel}>Saved Diseases</div>
              <div style={styles.statValue}>{savedDiseases.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Calendar size={24} />
              </div>
              <div style={styles.statLabel}>Last Assessment</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: isDarkMode ? '#e5e7eb' : '#1a1a1a' }}>
                {stats.lastAssessment ? formatDate(stats.lastAssessment).split(',')[0] : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={styles.tab(activeTab === 'assessments')}
            onClick={() => setActiveTab('assessments')}
          >
            <Activity size={20} />
            Assessments ({assessments.length})
          </button>
          <button
            style={styles.tab(activeTab === 'diseases')}
            onClick={() => setActiveTab('diseases')}
          >
            <BookmarkCheck size={20} />
            Saved Diseases ({savedDiseases.length})
          </button>
        </div>

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <>
            {assessments.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <div style={styles.emptyText}>No Assessments Yet</div>
                <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Complete a symptom assessment to see it here
                </p>
                <button
                  onClick={() => navigate('/symptom-checker')}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: '#0d9db8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Start Assessment
                </button>
              </div>
            ) : (
              <div style={styles.grid}>
                {assessments.map((assessment) => (
                  <div key={assessment.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={{ flex: 1 }}>
                        <h3 style={styles.cardTitle}>
                          {assessment.patientName || 'Anonymous'}
                        </h3>
                        <div style={styles.cardMeta}>
                          <Clock size={14} />
                          {formatDate(assessment.completedAt)}
                        </div>
                        <div style={styles.cardMeta}>
                          Age: {assessment.age} | {assessment.sex === 'male' ? 'Male' : 'Female'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        style={styles.deleteBtn}
                        title="Delete assessment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Triage Level */}
                    <div style={{ marginBottom: '12px' }}>
                      <span style={styles.badge(getTriageColor(assessment.triageLevel))}>
                        {getTriageLabel(assessment.triageLevel)}
                      </span>
                    </div>

                    {/* Symptoms */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                        Symptoms:
                      </div>
                      <div>
                        {assessment.symptoms.slice(0, 3).map((symptom, idx) => (
                          <span key={idx} style={styles.symptomChip}>
                            {symptom}
                          </span>
                        ))}
                        {assessment.symptoms.length > 3 && (
                          <span style={styles.symptomChip}>
                            +{assessment.symptoms.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Conditions */}
                    {assessment.conditions.length > 0 && (
                      <div style={styles.conditionsList}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                          Possible Conditions:
                        </div>
                        {assessment.conditions.slice(0, 3).map((condition, idx) => (
                          <div key={idx} style={styles.conditionItem}>
                            <span>{condition.name}</span>
                            <span style={{ color: '#0d9db8', fontWeight: 600 }}>
                              {condition.probability}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Saved Diseases Tab */}
        {activeTab === 'diseases' && (
          <>
            {savedDiseases.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🏥</div>
                <div style={styles.emptyText}>No Saved Diseases</div>
                <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  Browse diseases and save them for quick reference
                </p>
                <button
                  onClick={() => navigate('/diseases')}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: '#0d9db8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Browse Diseases
                </button>
              </div>
            ) : (
              <div style={styles.grid}>
                {savedDiseases.map((disease) => (
                  <div
                    key={disease.id}
                    style={styles.card}
                    onClick={() => navigate(`/diseases/${disease.diseaseSlug}`)}
                  >
                    <div style={styles.cardHeader}>
                      <div style={{ flex: 1 }}>
                        <h3 style={styles.cardTitle}>{disease.diseaseName}</h3>
                        <div style={styles.cardMeta}>
                          <Clock size={14} />
                          Saved {formatDate(disease.savedAt)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDisease(disease.id);
                        }}
                        style={styles.deleteBtn}
                        title="Remove from saved"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <span style={styles.badge('#0d9db8')}>
                        {disease.category}
                      </span>
                      {disease.severity && (
                        <span style={{ ...styles.badge('#f59e0b'), marginLeft: '8px' }}>
                          {disease.severity}
                        </span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.9rem',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      marginBottom: '12px',
                      lineHeight: 1.5
                    }}>
                      {disease.description?.substring(0, 100)}...
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#0d9db8',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      View Details <ExternalLink size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;