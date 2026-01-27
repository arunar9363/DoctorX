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
  Info,
  AlertTriangle,
  AlertCircle,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TrackerDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMetric, setActiveMetric] = useState('blood_pressure');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [, setShowAnalysisModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanningReport, setScanningReport] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('Diabetes');
  const [uploadedFile, setUploadedFile] = useState(null);

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

  const [newReading, setNewReading] = useState({
    date: new Date().toISOString().slice(0, 16),
    systolic: '',
    diastolic: '',
    pulse: '',
    value: '',
    context: '',
    notes: ''
  });

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

  useEffect(() => {
    // Load jsPDF library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

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

  const downloadPDF = async () => {
    if (!analysis) {
      alert('No analysis data available to export');
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      const addText = (text, size, style = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
          if (yPosition > pageHeight - margin - 35) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(line, margin, yPosition);
          yPosition += size * 0.5;
        });
        yPosition += 3;
      };

      // Header
      doc.setTextColor(13, 157, 184);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Health Tracking Analysis Report', margin, yPosition);
      yPosition += 15;

      doc.setDrawColor(13, 157, 184);
      doc.setLineWidth(1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Date
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin, yPosition);
      doc.text(`Condition: ${selectedCondition}`, pageWidth - margin - 60, yPosition);
      yPosition += 15;

      // Add Charts
      const chartData = prepareChartData();
      if (chartData.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(13, 157, 184);
        doc.text('Trend Analysis', margin, yPosition);
        yPosition += 10;

        // Create a simple visualization representation
        const metricName = getMetricCardsForCondition().find(m => m.id === activeMetric)?.title || 'Metric';
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(`${metricName} trends over time (${chartData.length} readings)`, margin, yPosition);
        yPosition += 8;

        // Add statistics
        const values = chartData.map(d => d.value);
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
        const min = Math.min(...values).toFixed(2);
        const max = Math.max(...values).toFixed(2);

        doc.setFillColor(240, 249, 255);
        doc.rect(margin, yPosition, maxWidth, 25, 'F');
        doc.setFontSize(9);
        doc.text(`Average: ${avg} ${getUnitForMetric(activeMetric)}`, margin + 5, yPosition + 8);
        doc.text(`Range: ${min} - ${max}`, margin + 5, yPosition + 16);
        yPosition += 30;
      }

      // Analysis Content
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 157, 184);
      doc.text('AI Analysis & Recommendations', margin, yPosition);
      yPosition += 10;

      // Add analysis text
      const lines = analysis.split('\n');
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          yPosition += 3;
          return;
        }

        if (trimmedLine.startsWith('##') || trimmedLine.startsWith('###')) {
          const cleanText = trimmedLine.replace(/#{2,3}/g, '').trim();
          addText(cleanText, 12, 'bold', [13, 157, 184]);
        } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          const cleanText = trimmedLine.replace(/\*\*/g, '').trim();
          addText(cleanText, 10, 'bold', [40, 40, 40]);
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          const cleanText = trimmedLine.replace(/^[-*]\s/, '').replace(/\*\*/g, '');
          addText('• ' + cleanText, 9, 'normal', [60, 60, 60]);
        } else {
          const cleanText = trimmedLine.replace(/\*\*/g, '');
          addText(cleanText, 9, 'normal', [60, 60, 60]);
        }
      });

      // Footer
      const footerY = pageHeight - 25;
      doc.setDrawColor(13, 157, 184);
      doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

      doc.setFillColor(255, 251, 235);
      doc.roundedRect(margin, footerY + 2, maxWidth, 15, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(120, 53, 15);
      doc.text('DISCLAIMER: This is AI-generated analysis. Please consult a healthcare provider.', margin + 4, footerY + 10);

      doc.save(`Health_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('PDF download failed. Please try again.');
    }
  };

  const prepareChartData = () => {
    const data = healthData[activeMetric] || [];
    if (activeMetric === 'blood_pressure') {
      return data.map(reading => ({
        date: new Date(reading.date).toLocaleDateString(),
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        value: reading.systolic
      }));
    }
    return data.map(reading => ({
      date: new Date(reading.date).toLocaleDateString(),
      value: reading.value
    }));
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

  const analyzeSeverity = (text) => {
    if (!text) return 'unknown';
    const lowerText = text.toLowerCase();

    const criticalKeywords = ['critical', 'severe', 'emergency', 'urgent'];
    const warningKeywords = ['elevated', 'high', 'concern', 'attention', 'warning'];
    const normalKeywords = ['normal', 'good', 'stable', 'improving'];

    if (criticalKeywords.some(kw => lowerText.includes(kw))) return 'critical';
    if (warningKeywords.some(kw => lowerText.includes(kw))) return 'warning';
    if (normalKeywords.some(kw => lowerText.includes(kw))) return 'normal';
    return 'info';
  };

  const getBadgeConfig = () => {
    const severity = analyzeSeverity(analysis);
    switch (severity) {
      case 'critical':
        return { icon: AlertCircle, text: 'Needs Immediate Attention', color: '#dc2626' };
      case 'warning':
        return { icon: AlertTriangle, text: 'Requires Monitoring', color: '#ea580c' };
      case 'normal':
        return { icon: CheckCircle, text: 'Results Look Good', color: '#0d9db8' };
      default:
        return { icon: FileText, text: 'Analysis Complete', color: '#3b82f6' };
    }
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
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      maxWidth: '1400px',
      margin: '0 auto 32px'
    },
    chartSection: {
      maxWidth: '1400px',
      margin: '0 auto 32px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb'
    },
    analysisSection: {
      maxWidth: '1400px',
      margin: '0 auto 32px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb'
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
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }
  };

  const chartData = prepareChartData();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={styles.headerTitle}>Chronic Care Health Tracker</h1>
            <p style={{ fontSize: '1rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Monitor your vital signs and track health trends for better chronic disease management
            </p>
          </div>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db',
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
              color: isDarkMode ? '#f3f4f6' : '#111827'
            }}
          >
            <option value="Diabetes">Diabetes</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Thyroid">Thyroid</option>
            <option value="General">General Health</option>
          </select>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>Total Readings</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: getTotalReadings() > 0 ? '#0d9db8' : isDarkMode ? '#64748b' : '#94a3b8', margin: 0 }}>{getTotalReadings()}</p>
          </div>
          <div style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>Tracking Since</p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827', margin: 0 }}>{getTrackingSince()}</p>
          </div>
          <div style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>Last Updated</p>
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
              style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isActive ? `2px solid ${metric.color}` : isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                boxShadow: isActive ? `0 4px 12px ${metric.color}40` : 'none',
                transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
              }}
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
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827', margin: 0 }}>
                    {metric.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '4px 0 0 0' }}>
                    {healthData[metric.id].length} readings
                  </p>
                </div>
              </div>
              {latestValue ? (
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: metric.color }}>
                  {latestValue} <span style={{ fontSize: '0.875rem', fontWeight: '400' }}>{metric.unit}</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>
                  No data yet
                </div>
              )}
            </div>
          );
        })}
      </div>

      {healthData[activeMetric]?.length > 0 && (
        <div style={styles.chartSection}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827', marginBottom: '20px' }}>
            {metricCards.find(m => m.id === activeMetric)?.title} Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {activeMetric === 'blood_pressure' ? (
                <>
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} name="Diastolic" />
                </>
              ) : (
                <Line type="monotone" dataKey="value" stroke={metricCards.find(m => m.id === activeMetric)?.color} strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {analysis && (
        <div style={styles.analysisSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827', margin: 0 }}>
              AI Health Analysis
            </h3>
            <button onClick={downloadPDF} style={styles.button(true)}>
              <Download size={20} />
              Export PDF
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb', borderRadius: '8px', marginBottom: '20px' }}>
            {React.createElement(getBadgeConfig().icon, { size: 22, style: { color: getBadgeConfig().color } })}
            <span style={{ fontSize: '1rem', fontWeight: '600', color: getBadgeConfig().color }}>
              {getBadgeConfig().text}
            </span>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            color: isDarkMode ? '#d1d5db' : '#374151',
            fontSize: '0.9375rem',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {analysis}
          </div>

          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: isDarkMode ? '#422006' : '#fffbeb', borderRadius: '8px', border: isDarkMode ? '1px solid #713f12' : '1px solid #fde68a' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertTriangle style={{ color: isDarkMode ? '#fbbf24' : '#d97706', flexShrink: 0, marginTop: '2px' }} size={18} />
              <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#fde68a' : '#78350f', lineHeight: '1.5', margin: 0 }}>
                <strong>Disclaimer:</strong> This is AI-generated analysis. Please consult with qualified healthcare providers for medical decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => setShowScanModal(true)} style={{ ...styles.button(true), background: 'linear-gradient(135deg, #0d9db8, #06b6d4)' }}>
          <Sparkles size={20} />
          Scan Report (AI)
        </button>
        <button onClick={() => setShowAddModal(true)} style={styles.button(true)}>
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
          {loading ? <><RefreshCw size={20} className="animate-spin" />Analyzing...</> : <><BarChart3 size={20} />Get AI Analysis</>}
        </button>
      </div>

      {/* Scan Modal */}
      {showScanModal && (
        <div style={styles.modal} onClick={() => setShowScanModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: isDarkMode ? '#f3f4f6' : '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={28} style={{ color: '#0d9db8' }} />
              Scan Medical Report
            </h2>
            <div
              style={{
                border: `2px dashed ${isDarkMode ? '#334155' : '#d1d5db'}`,
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb'
              }}
              onClick={() => document.getElementById('fileInput').click()}
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
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827' }}>{uploadedFile.name}</p>
                </div>
              ) : (
                <div>
                  <Upload size={48} style={{ color: isDarkMode ? '#64748b' : '#94a3b8', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827' }}>Click to upload or drag and drop</p>
                  <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>PNG, JPG, or PDF (Max 10MB)</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleScanReport} disabled={!uploadedFile || scanningReport} style={{ ...styles.button(true), flex: 1, opacity: (!uploadedFile || scanningReport) ? 0.5 : 1 }}>
                {scanningReport ? <><RefreshCw size={20} className="animate-spin" />Scanning...</> : <><Sparkles size={20} />Scan & Extract</>}
              </button>
              <button onClick={() => { setShowScanModal(false); setUploadedFile(null); }} style={{ ...styles.button(false), flex: 1 }}>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: isDarkMode ? '#f3f4f6' : '#111827', marginBottom: '24px' }}>
              Add {metricCards.find(m => m.id === activeMetric)?.title} Reading
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827' }}>Date & Time</label>
              <input
                type="datetime-local"
                value={newReading.date}
                onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db',
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  color: isDarkMode ? '#f3f4f6' : '#111827',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {activeMetric === 'blood_pressure' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827' }}>Systolic (mmHg)*</label>
                    <input type="number" value={newReading.systolic} onChange={(e) => setNewReading({ ...newReading, systolic: e.target.value })} placeholder="120" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db', backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f3f4f6' : '#111827', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827' }}>Diastolic (mmHg)*</label>
                    <input type="number" value={newReading.diastolic} onChange={(e) => setNewReading({ ...newReading, diastolic: e.target.value })} placeholder="80" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db', backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f3f4f6' : '#111827', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#111827' }}>
                  Value ({getUnitForMetric(activeMetric)})*
                </label>
                <input type="number" step="0.1" value={newReading.value} onChange={(e) => setNewReading({ ...newReading, value: e.target.value })} placeholder="Enter value" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db', backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f3f4f6' : '#111827', boxSizing: 'border-box' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleAddReading} style={{ ...styles.button(true), flex: 1 }}>
                <CheckCircle size={20} />
                Save Reading
              </button>
              <button onClick={() => setShowAddModal(false)} style={{ ...styles.button(false), flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerDashboard;