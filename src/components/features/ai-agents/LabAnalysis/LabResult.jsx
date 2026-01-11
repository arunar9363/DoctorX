import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, FileText, Download } from 'lucide-react';

const LabResult = ({ analysis }) => {
  // Analyze the text to determine severity
  const analyzeSeverity = (text) => {
    if (!text) return 'unknown';

    const lowerText = text.toLowerCase();

    // Critical keywords - RED
    const criticalKeywords = [
      'critical', 'severe', 'emergency', 'urgent', 'high risk', 'danger',
      'significantly elevated', 'significantly high', 'significantly low',
      'very high', 'very low', 'extremely', 'acute'
    ];

    // Warning keywords - YELLOW
    const warningKeywords = [
      'elevated', 'mildly elevated', 'moderate', 'concern', 'attention',
      'monitor', 'slightly abnormal', 'borderline', 'mild', 'mildly',
      'slightly low', 'slightly high', 'slightly elevated', 'low',
      'lower limit', 'upper limit', 'needs attention'
    ];

    // Normal keywords - GREEN
    const normalKeywords = [
      'normal', 'healthy', 'good', 'stable', 'no issues', 'within range',
      'satisfactory', 'adequate', 'within normal', 'no abnormal',
      'not detected', 'negative'
    ];

    // Count occurrences
    let criticalCount = 0;
    let warningCount = 0;
    let normalCount = 0;

    criticalKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) criticalCount++;
    });

    warningKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) warningCount++;
    });

    normalKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) normalCount++;
    });

    // Decision logic
    if (criticalCount > 0) {
      return 'critical';
    }

    if (warningCount > 0) {
      return 'warning';
    }

    if (normalCount > warningCount) {
      return 'normal';
    }

    return 'info';
  };

  const severity = analyzeSeverity(analysis);

  // Debug logging
  console.log("=== Lab Result Analysis ===");
  console.log("Detected Severity:", severity);
  console.log("Analysis preview:", analysis?.substring(0, 200));

  // Get badge configuration based on severity
  const getBadgeConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle size={20} />,
          text: 'Critical - Immediate Attention Required',
          bgColor: '#fee2e2',
          textColor: '#991b1b',
          borderColor: '#ef4444',
          gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} />,
          text: 'Warning - Needs Attention',
          bgColor: '#fef3c7',
          textColor: '#92400e',
          borderColor: '#f59e0b',
          gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        };
      case 'normal':
        return {
          icon: <CheckCircle size={20} />,
          text: 'Normal - Results Look Good',
          bgColor: '#d1fae5',
          textColor: '#065f46',
          borderColor: '#10b981',
          gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
        };
      default:
        return {
          icon: <FileText size={20} />,
          text: 'Analysis Complete',
          bgColor: '#dbeafe',
          textColor: '#1e40af',
          borderColor: '#3b82f6',
          gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
        };
    }
  };

  const badgeConfig = getBadgeConfig();

  // Function to download as PDF using jsPDF
  const downloadPDF = async () => {
    // Dynamically import jsPDF
    const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text, size, style = 'normal', color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(color[0], color[1], color[2]);

      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += size * 0.5;
      });
      yPosition += 3;
    };

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LAB RESULT ANALYSIS REPORT', pageWidth / 2, 20, { align: 'center' });

    yPosition = 40;

    // Status Badge
    const statusColors = {
      'critical': [239, 68, 68],
      'warning': [245, 158, 11],
      'normal': [16, 185, 129],
      'info': [59, 130, 246]
    };
    const statusColor = statusColors[severity] || statusColors['info'];

    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(margin, yPosition, maxWidth, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(badgeConfig.text.toUpperCase(), pageWidth / 2, yPosition + 8, { align: 'center' });

    yPosition += 20;

    // Date
    addText(`Generated: ${new Date().toLocaleString()}`, 10, 'normal', [100, 100, 100]);
    yPosition += 5;

    // Disclaimer Box
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(margin, yPosition, maxWidth, 20, 2, 2, 'FD');
    yPosition += 6;
    addText('⚠ DISCLAIMER: This is an AI-generated analysis. It is NOT a medical diagnosis. Please consult a certified healthcare provider.', 9, 'bold', [120, 53, 15]);
    yPosition += 8;

    // Main Content
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Parse and add analysis content
    const lines = analysis.split('\n');
    lines.forEach(line => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        yPosition += 3;
        return;
      }

      // Headers
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('###')) {
        yPosition += 3;
        const cleanText = trimmedLine.replace(/#{2,3}/g, '').trim();
        addText(cleanText, 14, 'bold', [15, 23, 42]);
      }
      // Bold text
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        const cleanText = trimmedLine.replace(/\*\*/g, '');
        addText(cleanText, 12, 'bold', [30, 41, 59]);
      }
      // Bullet points
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const cleanText = '• ' + trimmedLine.replace(/^[-*]\s/, '');
        addText(cleanText, 10, 'normal', [71, 85, 105]);
      }
      // Regular text
      else {
        // Handle inline bold
        if (trimmedLine.includes('**')) {
          const parts = trimmedLine.split('**');
          let currentX = margin;
          doc.setFontSize(10);

          parts.forEach((part, i) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
              currentX = margin;
            }

            if (i % 2 === 1) {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(30, 41, 59);
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(71, 85, 105);
            }

            const textWidth = doc.getTextWidth(part);
            if (currentX + textWidth > pageWidth - margin) {
              yPosition += 5;
              currentX = margin;
            }

            doc.text(part, currentX, yPosition);
            currentX += textWidth;
          });
          yPosition += 5;
        } else {
          addText(trimmedLine, 10, 'normal', [71, 85, 105]);
        }
      }
    });

    // Footer
    yPosition = pageHeight - 25;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    addText('Powered by Gemini 1.5 Flash', 8, 'normal', [100, 116, 139]);
    addText('🔒 Your data is processed securely and not stored permanently', 8, 'normal', [100, 116, 139]);

    // Save PDF
    doc.save(`Lab_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Helper to add colored badges to status words
  const addColoredBadges = (text) => {
    // Define patterns and their colors
    const patterns = [
      { regex: /\b(Normal)\b/gi, color: '#10b981', bg: '#d1fae5' },
      { regex: /\b(Elevated|Mildly Elevated|Slightly Elevated)\b/gi, color: '#f59e0b', bg: '#fef3c7' },
      { regex: /\b(Low|Slightly Low|Mildly Low)\b/gi, color: '#f59e0b', bg: '#fef3c7' },
      { regex: /\b(Critical|Severe|High Risk)\b/gi, color: '#ef4444', bg: '#fee2e2' }
    ];

    let parts = [text];

    patterns.forEach(({ regex, color, bg }) => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const segments = part.split(regex);
          segments.forEach((segment, i) => {
            if (i > 0 && i % 2 === 1) {
              // This is a matched keyword
              newParts.push(
                <span
                  key={`badge-${i}-${segment}`}
                  style={{
                    backgroundColor: bg,
                    color: color,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    marginLeft: '4px',
                    marginRight: '4px',
                    display: 'inline-block',
                    border: `1px solid ${color}40`
                  }}
                >
                  {segment}
                </span>
              );
            } else {
              newParts.push(segment);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  // Helper to format Markdown-style text to simple paragraphs
  const formatText = (text) => {
    if (!text) {
      return <p style={{ color: '#64748b' }}>No analysis data available</p>;
    }

    const lines = text.split('\n');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (trimmedLine === '') {
        return <div key={index} style={{ height: '8px' }} />;
      }

      // Headers (##, ###, or lines with **)
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('###') || (trimmedLine.startsWith('**') && trimmedLine.endsWith('**'))) {
        const cleanText = trimmedLine.replace(/#{2,3}/g, '').replace(/\*\*/g, '').trim();
        return (
          <h3 key={index} style={{
            marginTop: '20px',
            marginBottom: '12px',
            fontWeight: '700',
            color: '#0f172a',
            fontSize: '1.125rem',
            lineHeight: '1.4'
          }}>
            {cleanText}
          </h3>
        );
      }

      // Bold text in middle of line
      if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        return (
          <p key={index} style={{
            marginBottom: '10px',
            color: '#475569',
            lineHeight: '1.6',
            fontSize: '0.9375rem'
          }}>
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} style={{ fontWeight: '600', color: '#1e293b' }}>{part}</strong> : part
            )}
          </p>
        );
      }

      // Bullet points
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const cleanText = trimmedLine.replace(/^[-*]\s/, '');
        return (
          <li key={index} style={{
            marginBottom: '8px',
            marginLeft: '20px',
            color: '#475569',
            lineHeight: '1.6',
            fontSize: '0.9375rem'
          }}>
            {cleanText}
          </li>
        );
      }

      // Regular paragraph
      return (
        <p key={index} style={{
          marginBottom: '10px',
          color: '#475569',
          lineHeight: '1.6',
          fontSize: '0.9375rem'
        }}>
          {addColoredBadges(trimmedLine)}
        </p>
      );
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: `2px solid ${badgeConfig.borderColor}`
    }}>
      {/* Status Badge - Top */}
      <div style={{
        background: badgeConfig.gradient,
        padding: '24px 32px',
        borderBottom: `4px solid ${badgeConfig.borderColor}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ color: badgeConfig.borderColor, display: 'flex' }}>
              {badgeConfig.icon}
            </span>
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: badgeConfig.textColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {badgeConfig.text}
          </span>
        </div>
      </div>

      {/* Result Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '24px 32px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          fontWeight: '700',
          fontSize: '1.5rem',
          color: '#0f172a',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FileText size={24} style={{ color: '#3b82f6' }} />
          AI Analysis Report
        </h3>
        <p style={{
          margin: '8px 0 0 34px',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          Powered by Gemini 1.5 Flash
        </p>
      </div>

      {/* Disclaimer Alert */}
      <div style={{
        backgroundColor: '#fffbeb',
        borderBottom: '1px solid #fde68a',
        padding: '16px 32px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle style={{
            color: '#d97706',
            flexShrink: 0,
            marginTop: '2px'
          }} size={20} />
          <p style={{
            fontSize: '0.875rem',
            color: '#78350f',
            lineHeight: '1.5',
            margin: 0
          }}>
            <strong style={{ fontWeight: '600' }}>Disclaimer:</strong> This is an AI-generated analysis.
            It is <strong>not a medical diagnosis</strong>. Please consult a certified healthcare provider.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '32px'
      }}>
        <div style={{
          backgroundColor: '#fafafa',
          padding: '28px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ color: '#1e293b' }}>
            {formatText(analysis)}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '16px 32px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b'
          }}>
            <Info size={16} />
            <p style={{
              fontSize: '0.8125rem',
              fontWeight: '500',
              margin: 0
            }}>
              🔒 Your data is processed securely and not stored permanently
            </p>
          </div>

          <button
            onClick={downloadPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabResult;