import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Wind,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  BarChart3
} from 'lucide-react';
import Charts from './Charts';

const TrackerDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMetric, setActiveMetric] = useState('blood_pressure');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('Hypertension');

  // State for different health metrics
  const [healthData, setHealthData] = useState({
    blood_pressure: [],
    blood_glucose: [],
    heart_rate: [],
    weight: [],
    oxygen_saturation: []
  });

  // Form state for adding new readings
  const [newReading, setNewReading] = useState({
    date: new Date().toISOString().slice(0, 16),
    systolic: '',
    diastolic: '',
    pulse: '',
    value: '',
    context: '',
    notes: ''
  });

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

  // Load sample data on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Generate sample data for demonstration
    const today = new Date();
    const sampleBP = [];
    const sampleGlucose = [];
    const sampleHR = [];

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Blood Pressure
      sampleBP.push({
        date: date.toISOString(),
        systolic: 120 + Math.floor(Math.random() * 20),
        diastolic: 75 + Math.floor(Math.random() * 15),
        pulse: 70 + Math.floor(Math.random() * 20),
        context: i % 2 === 0 ? 'Morning' : 'Evening'
      });

      // Blood Glucose
      if (i % 2 === 0) {
        sampleGlucose.push({
          date: date.toISOString(),
          value: 90 + Math.floor(Math.random() * 30),
          unit: 'mg/dL',
          context: ['Fasting', 'Pre-meal', 'Post-meal'][Math.floor(Math.random() * 3)]
        });
      }

      // Heart Rate
      sampleHR.push({
        date: date.toISOString(),
        value: 65 + Math.floor(Math.random() * 25),
        unit: 'bpm',
        context: 'Resting'
      });
    }

    setHealthData({
      blood_pressure: sampleBP,
      blood_glucose: sampleGlucose,
      heart_rate: sampleHR,
      weight: [],
      oxygen_saturation: []
    });
  };

  const handleAddReading = () => {
    const reading = {
      date: newReading.date,
      ...(activeMetric === 'blood_pressure' ? {
        systolic: parseFloat(newReading.systolic),
        diastolic: parseFloat(newReading.diastolic),
        pulse: newReading.pulse ? parseInt(newReading.pulse) : null,
        context: newReading.context
      } : {
        value: parseFloat(newReading.value),
        unit: getUnitForMetric(activeMetric),
        context: newReading.context
      }),
      notes: newReading.notes
    };

    setHealthData(prev => ({
      ...prev,
      [activeMetric]: [...prev[activeMetric], reading].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      )
    }));

    // Reset form
    setNewReading({
      date: new Date().toISOString().slice(0, 16),
      systolic: '',
      diastolic: '',
      pulse: '',
      value: '',
      context: '',
      notes: ''
    });

    setShowAddModal(false);
  };

  const getUnitForMetric = (metric) => {
    const units = {
      blood_glucose: 'mg/dL',
      heart_rate: 'bpm',
      weight: 'kg',
      oxygen_saturation: '%'
    };
    return units[metric] || '';
  };

  const handleAnalyzeData = async () => {
    setLoading(true);

    try {
      // Prepare data for backend
      const trackingData = {
        patient_id: 'demo_patient_001',
        condition: selectedCondition,
        blood_pressure: healthData.blood_pressure,
        blood_glucose: healthData.blood_glucose,
        heart_rate: healthData.heart_rate,
        weight: healthData.weight,
        oxygen_saturation: healthData.oxygen_saturation,
        symptoms: '',
        lifestyle_changes: ''
      };

      const response = await fetch('http://localhost:8000/api/health-tracking/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData)
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setShowAnalysisModal(true);
      } else {
        alert('Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Could not connect to backend. Make sure the Python server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      id: 'blood_pressure',
      title: 'Blood Pressure',
      icon: Heart,
      color: '#ef4444',
      bgColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
      unit: 'mmHg'
    },
    {
      id: 'blood_glucose',
      title: 'Blood Glucose',
      icon: Droplet,
      color: '#f59e0b',
      bgColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
      unit: 'mg/dL'
    },
    {
      id: 'heart_rate',
      title: 'Heart Rate',
      icon: Activity,
      color: '#ec4899',
      bgColor: isDarkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)',
      unit: 'bpm'
    },
    {
      id: 'weight',
      title: 'Weight',
      icon: Weight,
      color: '#8b5cf6',
      bgColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
      unit: 'kg'
    },
    {
      id: 'oxygen_saturation',
      title: 'SpO₂',
      icon: Wind,
      color: '#0d9db8',
      bgColor: isDarkMode ? 'rgba(13, 157, 184, 0.1)' : 'rgba(13, 157, 184, 0.05)',
      unit: '%'
    }
  ];

  const getLatestReading = (metricType) => {
    const data = healthData[metricType];
    if (!data || data.length === 0) return null;

    const latest = data[data.length - 1];
    if (metricType === 'blood_pressure') {
      return `${latest.systolic}/${latest.diastolic}`;
    }
    return latest.value;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
      padding: '24px'
    },
    header: {
      maxWidth: '1400px',
      marginTop: '60px',
      margin: '0 auto 32px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: isDarkMode
        ? '0 4px 6px rgba(0, 0, 0, 0.3)'
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb'
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #0d9db8, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '8px'
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '24px'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      maxWidth: '1400px',
      margin: '0 auto 32px'
    },
    metricCard: (isActive, color) => ({
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: isActive
        ? `2px solid ${color}`
        : isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
      boxShadow: isActive
        ? `0 4px 12px ${color}40`
        : isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
      transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
    }),
    chartSection: {
      maxWidth: '1400px',
      margin: '0 auto 32px'
    },
    actionButtons: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    button: (isPrimary) => ({
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      backgroundColor: isPrimary ? '#0d9db8' : isDarkMode ? '#334155' : '#e5e7eb',
      color: isPrimary ? '#ffffff' : isDarkMode ? '#f3f4f6' : '#111827',
      boxShadow: isPrimary ? '0 2px 4px rgba(13, 157, 184, 0.3)' : 'none'
    }),
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      fontSize: '0.875rem'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db',
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      fontSize: '1rem',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={styles.headerTitle}>Chronic Care Health Tracker</h1>
            <p style={styles.headerSubtitle}>
              Monitor your vital signs and track health trends for better chronic disease management
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              style={{
                ...styles.input,
                width: 'auto',
                padding: '10px 16px'
              }}
            >
              <option value="Diabetes">Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Thyroid">Thyroid</option>
              <option value="General">General Health</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
            padding: '16px',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>
              Total Readings
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0d9db8', margin: 0 }}>
              {Object.values(healthData).reduce((sum, arr) => sum + arr.length, 0)}
            </p>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
            padding: '16px',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>
              Tracking Since
            </p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827', margin: 0 }}>
              30 Days Ago
            </p>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
            padding: '16px',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>
              Last Updated
            </p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827', margin: 0 }}>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Selection Cards */}
      <div style={styles.metricsGrid}>
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const isActive = activeMetric === metric.id;
          const latestValue = getLatestReading(metric.id);

          return (
            <div
              key={metric.id}
              style={styles.metricCard(isActive, metric.color, metric.bgColor)}
              onClick={() => setActiveMetric(metric.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: metric.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: metric.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    margin: 0
                  }}>
                    {metric.title}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    margin: '4px 0 0 0'
                  }}>
                    {healthData[metric.id].length} readings
                  </p>
                </div>
              </div>

              {latestValue && (
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: metric.color
                }}>
                  {latestValue} <span style={{ fontSize: '0.875rem', fontWeight: '400' }}>{metric.unit}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div style={styles.chartSection}>
        <Charts
          patientData={healthData[activeMetric]}
          metricType={activeMetric}
          timeRange={30}
          onTrendInsight={(insight) => console.log('Trend:', insight)}
        />
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          onClick={() => setShowAddModal(true)}
          style={styles.button(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(13, 157, 184, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(13, 157, 184, 0.3)';
          }}
        >
          <Plus size={20} />
          Add Reading
        </button>

        <button
          onClick={handleAnalyzeData}
          disabled={loading}
          style={{
            ...styles.button(true),
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(13, 157, 184, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(13, 157, 184, 0.3)';
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 size={20} />
              Get AI Analysis
            </>
          )}
        </button>

        <button
          onClick={() => alert('Export feature coming soon')}
          style={styles.button(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Download size={20} />
          Export Data
        </button>
      </div>

      {/* Add Reading Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: isDarkMode ? '#f3f4f6' : '#111827',
              marginBottom: '24px'
            }}>
              Add {metricCards.find(m => m.id === activeMetric)?.title} Reading
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date & Time</label>
              <input
                type="datetime-local"
                value={newReading.date}
                onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                style={styles.input}
              />
            </div>

            {activeMetric === 'blood_pressure' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Systolic (mmHg)</label>
                    <input
                      type="number"
                      value={newReading.systolic}
                      onChange={(e) => setNewReading({ ...newReading, systolic: e.target.value })}
                      placeholder="120"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Diastolic (mmHg)</label>
                    <input
                      type="number"
                      value={newReading.diastolic}
                      onChange={(e) => setNewReading({ ...newReading, diastolic: e.target.value })}
                      placeholder="80"
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Pulse (optional)</label>
                  <input
                    type="number"
                    value={newReading.pulse}
                    onChange={(e) => setNewReading({ ...newReading, pulse: e.target.value })}
                    placeholder="70"
                    style={styles.input}
                  />
                </div>
              </>
            ) : (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Value ({getUnitForMetric(activeMetric)})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newReading.value}
                  onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                  placeholder="Enter value"
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Context</label>
              <select
                value={newReading.context}
                onChange={(e) => setNewReading({ ...newReading, context: e.target.value })}
                style={styles.input}
              >
                <option value="">Select context...</option>
                {activeMetric === 'blood_pressure' && (
                  <>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="After Exercise">After Exercise</option>
                    <option value="Before Medication">Before Medication</option>
                  </>
                )}
                {activeMetric === 'blood_glucose' && (
                  <>
                    <option value="Fasting">Fasting</option>
                    <option value="Pre-meal">Pre-meal</option>
                    <option value="Post-meal">2 Hours Post-meal</option>
                    <option value="Bedtime">Bedtime</option>
                  </>
                )}
                {activeMetric === 'heart_rate' && (
                  <>
                    <option value="Resting">Resting</option>
                    <option value="After Exercise">After Exercise</option>
                    <option value="Morning">Morning</option>
                  </>
                )}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Notes (optional)</label>
              <textarea
                value={newReading.notes}
                onChange={(e) => setNewReading({ ...newReading, notes: e.target.value })}
                placeholder="Any additional notes..."
                style={{
                  ...styles.input,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleAddReading}
                style={{
                  ...styles.button(true),
                  flex: 1
                }}
              >
                <CheckCircle size={20} />
                Save Reading
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  ...styles.button(false),
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Modal */}
      {showAnalysisModal && analysis && (
        <div style={styles.modal} onClick={() => setShowAnalysisModal(false)}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: '900px',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                margin: 0
              }}>
                AI Health Analysis Report
              </h2>
              <button
                onClick={() => setShowAnalysisModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              color: isDarkMode ? '#d1d5db' : '#374151',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              {analysis}
            </div>

            <button
              onClick={() => setShowAnalysisModal(false)}
              style={{
                ...styles.button(true),
                width: '100%'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerDashboard;