import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Wind,
  Plus,
  TrendingUp,
  CheckCircle,
  Download,
  RefreshCw,
  BarChart3,
  Upload,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import Charts from './Charts';

const TrackerDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMetric, setActiveMetric] = useState('blood_pressure');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanningReport, setScanningReport] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('Hypertension');
  const [uploadedFile, setUploadedFile] = useState(null);

  // State for different health metrics - EMPTY BY DEFAULT (NO SAMPLE DATA)
  const [healthData, setHealthData] = useState({
    blood_pressure: [],
    blood_glucose: [],
    heart_rate: [],
    weight: [],
    oxygen_saturation: [],
    tsh: [],
    t3: [],
    t4: []
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

  // Update active metric when condition changes
  useEffect(() => {
    switch (selectedCondition) {
      case 'Diabetes':
        setActiveMetric('blood_glucose');
        break;
      case 'Hypertension':
        setActiveMetric('blood_pressure');
        break;
      case 'Thyroid':
        setActiveMetric('tsh');
        break;
      default:
        setActiveMetric('blood_pressure');
    }
  }, [selectedCondition]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PNG, JPG, or PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleScanReport = async () => {
    if (!uploadedFile) {
      alert('Please select a file to upload');
      return;
    }

    setScanningReport(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('patient_id', 'demo_patient_001');
      formData.append('condition', selectedCondition);

      const response = await fetch('http://localhost:8000/api/health-tracking/scan-report', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success && data.extracted_data) {
        const newHealthData = { ...healthData };
        let extractedCount = 0;

        if (data.extracted_data.blood_pressure?.length > 0) {
          newHealthData.blood_pressure = [
            ...healthData.blood_pressure,
            ...data.extracted_data.blood_pressure
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.blood_pressure.length;
        }

        if (data.extracted_data.blood_glucose?.length > 0) {
          newHealthData.blood_glucose = [
            ...healthData.blood_glucose,
            ...data.extracted_data.blood_glucose
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.blood_glucose.length;
        }

        if (data.extracted_data.heart_rate?.length > 0) {
          newHealthData.heart_rate = [
            ...healthData.heart_rate,
            ...data.extracted_data.heart_rate
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.heart_rate.length;
        }

        if (data.extracted_data.weight?.length > 0) {
          newHealthData.weight = [
            ...healthData.weight,
            ...data.extracted_data.weight
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.weight.length;
        }

        if (data.extracted_data.tsh?.length > 0) {
          newHealthData.tsh = [
            ...healthData.tsh,
            ...data.extracted_data.tsh
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.tsh.length;
        }

        if (data.extracted_data.t3?.length > 0) {
          newHealthData.t3 = [
            ...healthData.t3,
            ...data.extracted_data.t3
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.t3.length;
        }

        if (data.extracted_data.t4?.length > 0) {
          newHealthData.t4 = [
            ...healthData.t4,
            ...data.extracted_data.t4
          ].sort((a, b) => new Date(a.date) - new Date(b.date));
          extractedCount += data.extracted_data.t4.length;
        }

        setHealthData(newHealthData);

        let summaryMessage = `✅ Report scanned successfully!\n\n📊 Extracted ${extractedCount} total readings:\n`;
        if (data.extracted_data.blood_pressure?.length > 0) summaryMessage += `• ${data.extracted_data.blood_pressure.length} Blood Pressure readings\n`;
        if (data.extracted_data.blood_glucose?.length > 0) summaryMessage += `• ${data.extracted_data.blood_glucose.length} Blood Glucose readings\n`;
        if (data.extracted_data.heart_rate?.length > 0) summaryMessage += `• ${data.extracted_data.heart_rate.length} Heart Rate readings\n`;
        if (data.extracted_data.weight?.length > 0) summaryMessage += `• ${data.extracted_data.weight.length} Weight readings\n`;
        if (data.extracted_data.tsh?.length > 0) summaryMessage += `• ${data.extracted_data.tsh.length} TSH readings\n`;
        if (data.extracted_data.t3?.length > 0) summaryMessage += `• ${data.extracted_data.t3.length} T3 readings\n`;
        if (data.extracted_data.t4?.length > 0) summaryMessage += `• ${data.extracted_data.t4.length} T4 readings\n`;

        if (data.extracted_data.summary) {
          summaryMessage += `\n📋 ${data.extracted_data.summary}`;
        }

        alert(summaryMessage);

        setShowScanModal(false);
        setUploadedFile(null);
      } else {
        alert('❌ Could not extract data from the report. Please try manual entry or upload a clearer image.');
      }
    } catch (error) {
      console.error('Report scanning error:', error);
      alert('❌ Failed to scan report. Please ensure backend server is running on port 8000.');
    } finally {
      setScanningReport(false);
    }
  };

  const handleAddReading = () => {
    if (activeMetric === 'blood_pressure') {
      if (!newReading.systolic || !newReading.diastolic) {
        alert('Please enter both systolic and diastolic values');
        return;
      }
    } else {
      if (!newReading.value) {
        alert('Please enter a value');
        return;
      }
    }

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
      oxygen_saturation: '%',
      tsh: 'mIU/L',
      t3: 'ng/dL',
      t4: 'ng/dL'
    };
    return units[metric] || '';
  };

  const handleAnalyzeData = async () => {
    const totalReadings = Object.values(healthData).reduce((sum, arr) => sum + arr.length, 0);

    if (totalReadings === 0) {
      alert('⚠️ No data available for analysis. Please scan a report or add readings manually first.');
      return;
    }

    setLoading(true);

    try {
      const trackingData = {
        patient_id: 'demo_patient_001',
        condition: selectedCondition,
        blood_pressure: healthData.blood_pressure,
        blood_glucose: healthData.blood_glucose,
        heart_rate: healthData.heart_rate,
        weight: healthData.weight,
        oxygen_saturation: healthData.oxygen_saturation,
        tsh: healthData.tsh,
        t3: healthData.t3,
        t4: healthData.t4,
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
        alert('❌ Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('❌ Could not connect to backend. Ensure the Python server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const getMetricCardsForCondition = () => {
    const allCards = {
      blood_pressure: {
        id: 'blood_pressure',
        title: 'Blood Pressure',
        icon: Heart,
        color: '#ef4444',
        bgColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
        unit: 'mmHg',
        conditions: ['Hypertension', 'General']
      },
      blood_glucose: {
        id: 'blood_glucose',
        title: 'Blood Glucose',
        icon: Droplet,
        color: '#f59e0b',
        bgColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
        unit: 'mg/dL',
        conditions: ['Diabetes', 'General']
      },
      heart_rate: {
        id: 'heart_rate',
        title: 'Heart Rate',
        icon: Activity,
        color: '#ec4899',
        bgColor: isDarkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)',
        unit: 'bpm',
        conditions: ['Hypertension', 'General']
      },
      weight: {
        id: 'weight',
        title: 'Weight',
        icon: Weight,
        color: '#8b5cf6',
        bgColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        unit: 'kg',
        conditions: ['Diabetes', 'Hypertension', 'General']
      },
      oxygen_saturation: {
        id: 'oxygen_saturation',
        title: 'SpO₂',
        icon: Wind,
        color: '#0d9db8',
        bgColor: isDarkMode ? 'rgba(13, 157, 184, 0.1)' : 'rgba(13, 157, 184, 0.05)',
        unit: '%',
        conditions: ['General']
      },
      tsh: {
        id: 'tsh',
        title: 'TSH',
        icon: Activity,
        color: '#06b6d4',
        bgColor: isDarkMode ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)',
        unit: 'mIU/L',
        conditions: ['Thyroid']
      },
      t3: {
        id: 't3',
        title: 'T3',
        icon: TrendingUp,
        color: '#8b5cf6',
        bgColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        unit: 'ng/dL',
        conditions: ['Thyroid']
      },
      t4: {
        id: 't4',
        title: 'Free T4',
        icon: BarChart3,
        color: '#ec4899',
        bgColor: isDarkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)',
        unit: 'ng/dL',
        conditions: ['Thyroid']
      }
    };

    return Object.values(allCards).filter(card =>
      card.conditions.includes(selectedCondition)
    );
  };

  const metricCards = getMetricCardsForCondition();

  const getLatestReading = (metricType) => {
    const data = healthData[metricType];
    if (!data || data.length === 0) return null;

    const latest = data[data.length - 1];
    if (metricType === 'blood_pressure') {
      return `${latest.systolic}/${latest.diastolic}`;
    }
    return latest.value;
  };

  const getTotalReadings = () => {
    return Object.values(healthData).reduce((sum, arr) => sum + arr.length, 0);
  };

  const getTrackingSince = () => {
    let earliestDate = null;

    Object.values(healthData).forEach(readings => {
      if (readings.length > 0) {
        const firstDate = new Date(readings[0].date);
        if (!earliestDate || firstDate < earliestDate) {
          earliestDate = firstDate;
        }
      }
    });

    if (!earliestDate) return 'No data yet';

    const now = new Date();
    const diffDays = Math.floor((now - earliestDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
      padding: '24px',
      marginTop: '60px'
    },
    header: {
      maxWidth: '1400px',
      marginTop: '64px',
      margin: '0 auto 32px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
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
      border: isActive ? `2px solid ${color}` : isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
      boxShadow: isActive ? `0 4px 12px ${color}40` : isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
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
    },
    uploadArea: {
      border: `2px dashed ${isDarkMode ? '#334155' : '#d1d5db'}`,
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      border: `2px dashed ${isDarkMode ? '#334155' : '#d1d5db'}`
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={styles.headerTitle}>Chronic Care Health Tracker</h1>
            <p style={styles.headerSubtitle}>
              Monitor your vital signs and track health trends for better chronic disease management
            </p>
          </div>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            style={{ ...styles.input, width: 'auto', padding: '10px 16px' }}
          >
            <option value="Diabetes">Diabetes</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Thyroid">Thyroid</option>
            <option value="General">General Health</option>
          </select>
        </div>

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
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: getTotalReadings() > 0 ? '#0d9db8' : isDarkMode ? '#64748b' : '#94a3b8', margin: 0 }}>
              {getTotalReadings()}
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
              {getTrackingSince()}
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
              {getTotalReadings() > 0 ? new Date().toLocaleDateString() : 'No data'}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const isActive = activeMetric === metric.id;
          const latestValue = getLatestReading(metric.id);

          return (
            <div
              key={metric.id}
              style={styles.metricCard(isActive, metric.color)}
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

              {latestValue ? (
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: metric.color
                }}>
                  {latestValue} <span style={{ fontSize: '0.875rem', fontWeight: '400' }}>{metric.unit}</span>
                </div>
              ) : (
                <div style={{
                  fontSize: '0.875rem',
                  color: isDarkMode ? '#64748b' : '#94a3b8',
                  fontStyle: 'italic'
                }}>
                  No data yet
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={styles.chartSection}>
        {healthData[activeMetric]?.length > 0 ? (
          <Charts
            patientData={healthData[activeMetric]}
            metricType={activeMetric}
            timeRange={30}
          />
        ) : (
          <div style={styles.emptyState}>
            <Info size={48} style={{ color: isDarkMode ? '#64748b' : '#94a3b8', margin: '0 auto 16px' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: isDarkMode ? '#f3f4f6' : '#111827',
              marginBottom: '8px'
            }}>
              No {metricCards.find(m => m.id === activeMetric)?.title} Data Yet
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              marginBottom: '24px'
            }}>
              Start tracking by scanning a report or adding readings manually
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowScanModal(true)}
                style={{
                  ...styles.button(true),
                  background: 'linear-gradient(135deg, #0d9db8, #06b6d4)'
                }}
              >
                <Sparkles size={20} />
                Scan Report
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                style={styles.button(false)}
              >
                <Plus size={20} />
                Add Manually
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        <button
          onClick={() => setShowScanModal(true)}
          style={{
            ...styles.button(true),
            background: 'linear-gradient(135deg, #0d9db8, #06b6d4)'
          }}
        >
          <Sparkles size={20} />
          Scan Report (AI)
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          style={styles.button(true)}
        >
          <Plus size={20} />
          Add Manually
        </button>

        <button
          onClick={handleAnalyzeData}
          disabled={loading || getTotalReadings() === 0}
          style={{
            ...styles.button(true),
            opacity: (loading || getTotalReadings() === 0) ? 0.5 : 1,
            cursor: (loading || getTotalReadings() === 0) ? 'not-allowed' : 'pointer'
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
          onClick={() => getTotalReadings() === 0 ? alert('No data to export') : alert('Export coming soon!')}
          style={styles.button(false)}
        >
          <Download size={20} />
          Export Data
        </button>
      </div>

      {/* Scan Report Modal */}
      {showScanModal && (
        <div style={styles.modal} onClick={() => setShowScanModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: isDarkMode ? '#f3f4f6' : '#111827',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Sparkles size={28} style={{ color: '#0d9db8' }} />
              Scan Medical Report
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              marginBottom: '24px'
            }}>
              Upload your lab report, BP log, or glucose monitoring sheet. Our AI will automatically extract the data.
            </p>

            <div
              style={styles.uploadArea}
              onClick={() => document.getElementById('fileInput').click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#0d9db8';
                e.currentTarget.style.backgroundColor = isDarkMode ? '#1e293b' : '#f0f9ff';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = isDarkMode ? '#334155' : '#d1d5db';
                e.currentTarget.style.backgroundColor = isDarkMode ? '#0f172a' : '#f9fafb';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setUploadedFile(file);
                }
                e.currentTarget.style.borderColor = isDarkMode ? '#334155' : '#d1d5db';
                e.currentTarget.style.backgroundColor = isDarkMode ? '#0f172a' : '#f9fafb';
              }}
            >
              <input
                id="fileInput"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {uploadedFile ? (
                <div>
                  <FileText size={48} style={{ color: '#0d9db8', margin: '0 auto 12px' }} />
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    marginBottom: '4px'
                  }}>
                    {uploadedFile.name}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: isDarkMode ? '#9ca3af' : '#6b7280'
                  }}>
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload size={48} style={{ color: isDarkMode ? '#64748b' : '#94a3b8', margin: '0 auto 12px' }} />
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    marginBottom: '8px'
                  }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: isDarkMode ? '#9ca3af' : '#6b7280'
                  }}>
                    PNG, JPG, or PDF (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: isDarkMode ? '#0f172a' : '#f0f9ff', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#334155' : '#bae6fd'}` }}>
              <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#0369a1', margin: 0, lineHeight: '1.5' }}>
                <strong>✨ AI-Powered Extraction:</strong> Our system can extract Blood Pressure, Glucose, Heart Rate, Weight, and other vital signs from scanned reports.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleScanReport}
                disabled={!uploadedFile || scanningReport}
                style={{
                  ...styles.button(true),
                  flex: 1,
                  opacity: (!uploadedFile || scanningReport) ? 0.5 : 1,
                  cursor: (!uploadedFile || scanningReport) ? 'not-allowed' : 'pointer'
                }}
              >
                {scanningReport ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Scan & Extract Data
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowScanModal(false);
                  setUploadedFile(null);
                }}
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
                    <label style={styles.label}>Systolic (mmHg)*</label>
                    <input
                      type="number"
                      value={newReading.systolic}
                      onChange={(e) => setNewReading({ ...newReading, systolic: e.target.value })}
                      placeholder="120"
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Diastolic (mmHg)*</label>
                    <input
                      type="number"
                      value={newReading.diastolic}
                      onChange={(e) => setNewReading({ ...newReading, diastolic: e.target.value })}
                      placeholder="80"
                      style={styles.input}
                      required
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
                  Value ({getUnitForMetric(activeMetric)})*
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newReading.value}
                  onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                  placeholder="Enter value"
                  style={styles.input}
                  required
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
                {(activeMetric === 'tsh' || activeMetric === 't3' || activeMetric === 't4') && (
                  <>
                    <option value="Fasting">Fasting</option>
                    <option value="Morning">Morning</option>
                    <option value="Lab Test">Lab Test</option>
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