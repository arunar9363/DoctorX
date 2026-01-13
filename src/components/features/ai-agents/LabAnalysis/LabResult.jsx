import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';

const LabResult = ({ analysis }) => {
  const analyzeSeverity = (text) => {
    if (!text) return 'unknown';
    const lowerText = text.toLowerCase();

    const criticalKeywords = [
      'critical', 'severe', 'emergency', 'urgent', 'high risk', 'danger',
      'significantly elevated', 'significantly high', 'significantly low',
      'very high', 'very low', 'extremely', 'acute'
    ];

    const warningKeywords = [
      'elevated', 'mildly elevated', 'moderate', 'concern', 'attention',
      'monitor', 'slightly abnormal', 'borderline', 'mild', 'mildly',
      'slightly low', 'slightly high', 'slightly elevated', 'low',
      'lower limit', 'upper limit', 'needs attention'
    ];

    const normalKeywords = [
      'normal', 'healthy', 'good', 'stable', 'no issues', 'within range',
      'satisfactory', 'adequate', 'within normal', 'no abnormal',
      'not detected', 'negative'
    ];

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

    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    if (normalCount > warningCount) return 'normal';
    return 'info';
  };

  const severity = analyzeSeverity(analysis);

  const getBadgeConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle size={22} />,
          text: 'Needs Immediate Attention',
          textColor: '#dc2626',
          iconColor: '#dc2626'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={22} />,
          text: 'Requires Monitoring',
          textColor: '#ea580c',
          iconColor: '#ea580c'
        };
      case 'normal':
        return {
          icon: <CheckCircle size={22} />,
          text: 'Results Look Good',
          textColor: '#0d9db8',
          iconColor: '#0d9db8'
        };
      default:
        return {
          icon: <FileText size={22} />,
          text: 'Analysis Complete',
          textColor: '#3b82f6',
          iconColor: '#3b82f6'
        };
    }
  };

  const badgeConfig = getBadgeConfig();

  const downloadPDF = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      const addText = (text, size, style = 'normal', color = [0, 0, 0], align = 'left') => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(color[0], color[1], color[2]);

        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
          if (yPosition > pageHeight - margin - 35) {
            doc.addPage();
            yPosition = margin;
          }

          if (align === 'justify' && index < lines.length - 1 && lines.length > 1) {
            const words = line.split(' ');
            if (words.length > 1) {
              const lineWidth = doc.getTextWidth(line);
              const spaceWidth = (maxWidth - lineWidth) / (words.length - 1);
              let xPos = margin;

              words.forEach((word, wordIndex) => {
                doc.text(word, xPos, yPosition);
                xPos += doc.getTextWidth(word) + doc.getTextWidth(' ') + (wordIndex < words.length - 1 ? spaceWidth : 0);
              });
            } else {
              doc.text(line, margin, yPosition);
            }
          } else {
            doc.text(line, margin, yPosition);
          }

          yPosition += size * 0.5;
        });
        yPosition += 3;
      };

      const addTextWithHighlights = (text, size) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', 'normal');

        const highlightPatterns = [
          { keywords: ['ABNORMAL', 'abnormal', 'Abnormal'], color: [220, 38, 38], bg: [254, 226, 226] },
          { keywords: ['NORMAL', 'normal', 'Normal'], color: [5, 150, 105], bg: [209, 250, 229] },
          { keywords: ['elevated', 'Elevated', 'high', 'High'], color: [234, 88, 12], bg: [254, 215, 170] },
          { keywords: ['low', 'Low'], color: [234, 88, 12], bg: [254, 215, 170] },
          { keywords: ['Critical', 'critical', 'Severe', 'severe'], color: [220, 38, 38], bg: [254, 202, 202] }
        ];

        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach(line => {
          if (yPosition > pageHeight - margin - 35) {
            doc.addPage();
            yPosition = margin;
          }

          let xPos = margin;
          const words = line.split(' ');

          words.forEach((word) => {
            let highlighted = false;

            for (const pattern of highlightPatterns) {
              if (pattern.keywords.some(kw => word.includes(kw))) {
                const wordWidth = doc.getTextWidth(word);
                doc.setFillColor(pattern.bg[0], pattern.bg[1], pattern.bg[2]);
                doc.roundedRect(xPos - 1, yPosition - size * 0.35, wordWidth + 2, size * 0.5, 1, 1, 'F');
                doc.setTextColor(pattern.color[0], pattern.color[1], pattern.color[2]);
                doc.setFont('helvetica', 'bold');
                doc.text(word, xPos, yPosition);
                doc.setFont('helvetica', 'normal');
                highlighted = true;
                break;
              }
            }

            if (!highlighted) {
              doc.setTextColor(60, 60, 60);
              doc.text(word, xPos, yPosition);
            }

            xPos += doc.getTextWidth(word + ' ');
          });

          yPosition += size * 0.6;
        });
        yPosition += 3;
      };

      try {
        const logoImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = '/assets/MAINLOGO1.png';
        });

        const logoMaxWidth = 30;
        const logoMaxHeight = 15;
        const aspectRatio = logoImg.width / logoImg.height;

        let logoWidth, logoHeight;
        if (aspectRatio > logoMaxWidth / logoMaxHeight) {
          logoWidth = logoMaxWidth;
          logoHeight = logoMaxWidth / aspectRatio;
        } else {
          logoHeight = logoMaxHeight;
          logoWidth = logoMaxHeight * aspectRatio;
        }

        const logoY = yPosition + (15 - logoHeight) / 2;
        doc.addImage(logoImg, 'PNG', margin, logoY, logoWidth, logoHeight);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        console.log('Logo not loaded, continuing without it');
      }

      doc.setTextColor(13, 157, 184);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Lab Result Analysis Report', margin + 48, yPosition + 10, { align: 'left' });

      yPosition += 22;
      doc.setDrawColor(13, 157, 184);
      doc.setLineWidth(1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);

      yPosition += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin, yPosition);

      yPosition += 10;

      const statusColors = {
        'critical': [220, 38, 38],
        'warning': [234, 88, 12],
        'normal': [13, 157, 184],
        'info': [59, 130, 246]
      };
      const statusColor = statusColors[severity] || statusColors['info'];

      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(margin, yPosition, maxWidth, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(badgeConfig.text.toUpperCase(), pageWidth / 2, yPosition + 8, { align: 'center' });

      yPosition += 20;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 12;

      const lines = analysis.split('\n');
      let inInvestigationsSection = false;
      let tableData = [];

      const addTableToPDF = () => {
        if (tableData.length === 0) return;

        yPosition += 5;

        const tableHeight = (tableData.length + 1) * 8 + 15;
        if (yPosition + tableHeight > pageHeight - margin - 35) {
          doc.addPage();
          yPosition = margin;
        }

        const colWidths = [55, 35, 40, 40];
        const tableStartX = margin;
        const rowHeight = 8;

        doc.setFillColor(13, 157, 184);
        doc.rect(tableStartX, yPosition, maxWidth, rowHeight, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);

        doc.text('Test Name', tableStartX + 2, yPosition + 5.5);
        doc.text('Result', tableStartX + colWidths[0] + 2, yPosition + 5.5);
        doc.text('Normal Range', tableStartX + colWidths[0] + colWidths[1] + 2, yPosition + 5.5);
        doc.text('Status', tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPosition + 5.5);

        yPosition += rowHeight;

        tableData.forEach((row, idx) => {
          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
          } else {
            doc.setFillColor(255, 255, 255);
          }
          doc.rect(tableStartX, yPosition, maxWidth, rowHeight, 'F');

          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.1);
          doc.line(tableStartX, yPosition, tableStartX + maxWidth, yPosition);

          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 41, 59);

          doc.setFont('helvetica', 'bold');
          const testNameLines = doc.splitTextToSize(row.testName, colWidths[0] - 4);
          doc.text(testNameLines[0], tableStartX + 2, yPosition + 5.5);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(51, 65, 85);
          doc.text(row.result, tableStartX + colWidths[0] + 2, yPosition + 5.5);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          const rangeLines = doc.splitTextToSize(row.normalRange, colWidths[2] - 4);
          doc.text(rangeLines[0], tableStartX + colWidths[0] + colWidths[1] + 2, yPosition + 5.5);

          const statusLower = row.status.toLowerCase();
          let statusBgColor, statusTextColor;

          if (statusLower.includes('abnormal') || statusLower.includes('low') || statusLower.includes('high')) {
            statusBgColor = [254, 226, 226];
            statusTextColor = [220, 38, 38];
          } else if (statusLower.includes('normal')) {
            statusBgColor = [209, 250, 229];
            statusTextColor = [5, 150, 105];
          } else if (statusLower.includes('borderline')) {
            statusBgColor = [254, 215, 170];
            statusTextColor = [234, 88, 12];
          } else {
            statusBgColor = [248, 250, 252];
            statusTextColor = [71, 85, 105];
          }

          const statusX = tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2;
          const statusBoxWidth = 35;
          const statusBoxHeight = 5;
          const statusBoxY = yPosition + 2;

          doc.setFillColor(statusBgColor[0], statusBgColor[1], statusBgColor[2]);
          doc.roundedRect(statusX, statusBoxY, statusBoxWidth, statusBoxHeight, 1, 1, 'F');

          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(statusTextColor[0], statusTextColor[1], statusTextColor[2]);
          const statusLines = doc.splitTextToSize(row.status, statusBoxWidth - 2);
          doc.text(statusLines[0], statusX + statusBoxWidth / 2, statusBoxY + 3.5, { align: 'center' });

          yPosition += rowHeight;
        });

        doc.setDrawColor(226, 232, 240);
        doc.line(tableStartX, yPosition, tableStartX + maxWidth, yPosition);

        yPosition += 8;
        tableData = [];
      };

      lines.forEach(line => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          addTableToPDF();
          yPosition += 3;
          return;
        }

        if (trimmedLine.toUpperCase().includes('INVESTIGATIONS') || trimmedLine.toUpperCase().includes('### 3.')) {
          addTableToPDF();
          inInvestigationsSection = true;
        }

        if ((trimmedLine.startsWith('##') || trimmedLine.startsWith('###')) &&
          !trimmedLine.toUpperCase().includes('INVESTIGATIONS')) {
          addTableToPDF();
          inInvestigationsSection = false;
        }

        if (inInvestigationsSection) {
          const pipePattern = /^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/;
          const match = trimmedLine.match(pipePattern);

          if (match) {
            const testName = match[1].trim();
            const result = match[2].trim();
            const normalRange = match[3].trim();
            const status = match[4].trim();

            // Skip header row and separator row
            if (testName !== 'Test Name' && !testName.includes('---') && !testName.includes('|--') && testName !== '') {
              tableData.push({ testName, result, normalRange, status });
              return;
            } else if (testName === 'Test Name' || testName.includes('---') || testName.includes('|--')) {
              // Skip these lines completely
              return;
            }
          }

          const imagingPattern = /^[-*]\s*\*\*(.+?)\*\*:\s*(.+?)\s*->\s*(.+)$/i;
          const imagingMatch = trimmedLine.match(imagingPattern);

          if (imagingMatch) {
            addTableToPDF();

            yPosition += 5;
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(margin, yPosition, maxWidth, 20, 2, 2, 'F');

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 41, 59);
            doc.text(imagingMatch[1].trim(), margin + 3, yPosition + 5);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.text(`Finding: ${imagingMatch[2].trim()}`, margin + 3, yPosition + 10);

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(13, 157, 184);
            doc.text(`Impression: ${imagingMatch[3].trim()}`, margin + 3, yPosition + 15);

            yPosition += 25;
            return;
          }
        }

        addTableToPDF();

        if (trimmedLine.startsWith('##') || trimmedLine.startsWith('###')) {
          yPosition += 4;
          const cleanText = trimmedLine.replace(/#{2,3}/g, '').trim();
          addText(cleanText, 13, 'bold', [13, 157, 184], 'left');
        } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          const cleanText = trimmedLine.replace(/\*\*/g, '').trim();
          addText(cleanText, 11, 'bold', [40, 40, 40], 'left');
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          let cleanText = trimmedLine.replace(/^[-*]\s/, '').replace(/\*\*/g, '');
          addTextWithHighlights('• ' + cleanText, 10);
        } else {
          const cleanText = trimmedLine.replace(/\*\*/g, '');
          addTextWithHighlights(cleanText, 10);
        }
      });

      addTableToPDF();

      const footerY = pageHeight - 28;

      doc.setDrawColor(13, 157, 184);
      doc.setLineWidth(0.8);
      doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

      doc.setFillColor(255, 251, 235);
      doc.setDrawColor(234, 179, 8);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, footerY + 2, maxWidth, 18, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(120, 53, 15);
      const disclaimerLines = doc.splitTextToSize('DISCLAIMER: This is an AI-generated analysis and NOT a medical diagnosis. Please consult a qualified healthcare provider for medical advice.', maxWidth - 8);
      let disclaimerY = footerY + 7;
      disclaimerLines.forEach(line => {
        doc.text(line, margin + 4, disclaimerY);
        disclaimerY += 4;
      });

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(13, 157, 184);
      doc.text('Powered by AI Analysis Engine', pageWidth / 2, footerY + 24, { align: 'center' });

      doc.save(`Lab_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);

      document.head.removeChild(script);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('PDF download failed. Please try again.');
    }
  };

  const addColoredBadges = (text) => {
    const patterns = [
      { regex: /\b(NORMAL|Normal)\b/gi, color: '#059669', bg: '#d1fae5' },
      { regex: /\b(ABNORMAL|Abnormal|Elevated|Mildly Elevated|Slightly Elevated)\b/gi, color: '#dc2626', bg: '#fee2e2' },
      { regex: /\b(Low|Slightly Low|Mildly Low)\b/gi, color: '#ea580c', bg: '#fed7aa' },
      { regex: /\b(Critical|Severe|High Risk|Borderline)\b/gi, color: '#dc2626', bg: '#fecaca' },
      { regex: /\b(Not Specified|Not Applicable)\b/gi, color: '#64748b', bg: '#f1f5f9' }
    ];

    let parts = [text];

    patterns.forEach(({ regex, color, bg }) => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const segments = part.split(regex);
          segments.forEach((segment, i) => {
            if (i > 0 && i % 2 === 1) {
              newParts.push(
                <span
                  key={`badge-${i}-${segment}`}
                  style={{
                    backgroundColor: bg,
                    color: color,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    marginLeft: '3px',
                    marginRight: '3px',
                    display: 'inline-block'
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

  const parseTableRow = (line) => {
    const pipePattern = /^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/;
    const pipeMatch = line.match(pipePattern);

    if (pipeMatch) {
      const testName = pipeMatch[1].trim();
      const result = pipeMatch[2].trim();
      const normalRange = pipeMatch[3].trim();
      const status = pipeMatch[4].trim();

      // Skip header, separator rows, and empty rows
      if (testName === 'Test Name' || testName.includes('---') || testName.includes('--') || testName === '' || line.match(/^\|[-:\s|]+\|$/)) {
        return { isTableRow: false };
      }

      return {
        isTableRow: true,
        testName,
        result,
        normalRange,
        status
      };
    }

    const imagingPattern = /^[-*]\s*\*\*(.+?)\*\*:\s*(.+?)\s*->\s*(.+)$/i;
    const imagingMatch = line.match(imagingPattern);

    if (imagingMatch) {
      return {
        isImagingFinding: true,
        region: imagingMatch[1].trim(),
        finding: imagingMatch[2].trim(),
        impression: imagingMatch[3].trim()
      };
    }

    return { isTableRow: false };
  };

  const formatText = (text) => {
    if (!text) {
      return <p style={{ color: '#64748b' }}>No analysis data available</p>;
    }

    const lines = text.split('\n');
    const elements = [];
    let tableRows = [];
    let inInvestigationsSection = false;
    const isMobile = window.innerWidth <= 768;

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} style={{
            overflowX: 'auto',
            marginBottom: isMobile ? '12px' : '16px',
            marginTop: isMobile ? '8px' : '12px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#0d9db8' }}>
                  <th style={{
                    padding: isMobile ? '8px 6px' : '12px 16px',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: '600',
                    borderBottom: '2px solid #0a7a8f'
                  }}>Test Name</th>
                  <th style={{
                    padding: isMobile ? '8px 6px' : '12px 16px',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: '600',
                    borderBottom: '2px solid #0a7a8f'
                  }}>Result</th>
                  <th style={{
                    padding: isMobile ? '8px 6px' : '12px 16px',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: '600',
                    borderBottom: '2px solid #0a7a8f'
                  }}>Normal Range</th>
                  <th style={{
                    padding: isMobile ? '8px 6px' : '12px 16px',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: '600',
                    borderBottom: '2px solid #0a7a8f'
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, idx) => {
                  const statusLower = row.status.toLowerCase();
                  let statusColor = '#475569';
                  let statusBg = '#f8fafc';

                  if (statusLower.includes('abnormal') || statusLower.includes('low') || statusLower.includes('high')) {
                    statusColor = '#dc2626';
                    statusBg = '#fee2e2';
                  } else if (statusLower.includes('normal')) {
                    statusColor = '#059669';
                    statusBg = '#d1fae5';
                  } else if (statusLower.includes('borderline')) {
                    statusColor = '#ea580c';
                    statusBg = '#fed7aa';
                  }

                  return (
                    <tr key={idx} style={{
                      backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                      transition: 'background-color 0.2s'
                    }}>
                      <td style={{
                        padding: isMobile ? '8px 6px' : '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>{row.testName}</td>
                      <td style={{
                        padding: isMobile ? '8px 6px' : '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        color: '#334155',
                        fontWeight: '600'
                      }}>{row.result}</td>
                      <td style={{
                        padding: isMobile ? '8px 6px' : '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        color: '#64748b'
                      }}>{row.normalRange}</td>
                      <td style={{
                        padding: isMobile ? '8px 6px' : '12px 16px',
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <span style={{
                          backgroundColor: statusBg,
                          color: statusColor,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '600',
                          fontSize: isMobile ? '0.7rem' : '0.8125rem',
                          display: 'inline-block'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        flushTable();
        elements.push(<div key={`space-${index}`} style={{ height: '8px' }} />);
        return;
      }

      if (trimmedLine.toUpperCase().includes('INVESTIGATIONS') || trimmedLine.toUpperCase().includes('### 3.')) {
        flushTable();
        inInvestigationsSection = true;
      }

      if ((trimmedLine.startsWith('###') || trimmedLine.startsWith('##')) &&
        !trimmedLine.toUpperCase().includes('INVESTIGATIONS')) {
        flushTable();
        inInvestigationsSection = false;
      }

      if (inInvestigationsSection) {
        // Skip the separator line
        if (trimmedLine.match(/^\|[-:\s|]+\|$/)) {
          return;
        }

        const tableData = parseTableRow(trimmedLine);

        if (tableData.isTableRow) {
          tableRows.push(tableData);
          return;
        }

        if (tableData.isImagingFinding) {
          flushTable();
          elements.push(
            <div key={`imaging-${index}`} style={{
              marginBottom: isMobile ? '10px' : '14px',
              padding: isMobile ? '10px' : '14px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #0d9db8',
              borderRadius: '6px'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#1e293b',
                fontSize: isMobile ? '0.8125rem' : '0.9375rem',
                marginBottom: '6px'
              }}>
                {tableData.region}
              </div>
              <div style={{
                color: '#475569',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                marginBottom: '6px'
              }}>
                <strong>Finding:</strong> {tableData.finding}
              </div>
              <div style={{
                color: '#0d9db8',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: '600'
              }}>
                <strong>Impression:</strong> {tableData.impression}
              </div>
            </div>
          );
          return;
        }
      }

      flushTable();

      if (trimmedLine.startsWith('###') || trimmedLine.startsWith('##') || (trimmedLine.startsWith('**') && trimmedLine.endsWith('**'))) {
        const cleanText = trimmedLine.replace(/#{2,3}/g, '').replace(/\*\*/g, '').trim();
        elements.push(
          <h3 key={`header-${index}`} style={{
            marginTop: isMobile ? '16px' : '24px',
            marginBottom: isMobile ? '8px' : '12px',
            fontWeight: '600',
            color: '#1e293b',
            fontSize: isMobile ? '0.95rem' : '1.125rem',
            lineHeight: '1.5'
          }}>
            {cleanText}
          </h3>
        );
        return;
      }

      if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        elements.push(
          <p key={`text-${index}`} style={{
            marginBottom: isMobile ? '8px' : '12px',
            color: '#475569',
            lineHeight: '1.6',
            fontSize: isMobile ? '0.8125rem' : '0.9375rem',
            textAlign: 'justify'
          }}>
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} style={{ fontWeight: '600', color: '#334155' }}>{part}</strong> : part
            )}
          </p>
        );
        return;
      }

      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const cleanText = trimmedLine.replace(/^[-*]\s/, '');
        elements.push(
          <li key={`bullet-${index}`} style={{
            marginBottom: isMobile ? '6px' : '10px',
            marginLeft: isMobile ? '16px' : '24px',
            color: '#475569',
            lineHeight: '1.6',
            fontSize: isMobile ? '0.8125rem' : '0.9375rem',
            textAlign: 'justify'
          }}>
            {cleanText}
          </li>
        );
        return;
      }

      elements.push(
        <p key={`para-${index}`} style={{
          marginBottom: isMobile ? '8px' : '12px',
          color: '#475569',
          lineHeight: '1.6',
          fontSize: isMobile ? '0.8125rem' : '0.9375rem',
          textAlign: 'justify'
        }}>
          {addColoredBadges(trimmedLine)}
        </p>
      );
    });

    flushTable();

    return elements;
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '24px',
      backgroundColor: 'transparent'
    }}>
      <h1 style={{
        fontSize: isMobile ? '1.25rem' : '2rem',
        fontWeight: '700',
        color: '#0d9db8',
        textAlign: 'center',
        marginBottom: isMobile ? '16px' : '32px',
        letterSpacing: '-0.025em'
      }}>
        Lab Result Analysis Report
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '12px',
        marginBottom: isMobile ? '12px' : '24px',
        padding: isMobile ? '10px 12px' : '16px 24px',
      }}>
        <span style={{ color: badgeConfig.iconColor, display: 'flex' }}>
          {React.cloneElement(badgeConfig.icon, { size: isMobile ? 18 : 22 })}
        </span>
        <span style={{
          fontSize: isMobile ? '0.875rem' : '1.125rem',
          fontWeight: '600',
          color: badgeConfig.textColor
        }}>
          {badgeConfig.text}
        </span>
      </div>

      <div style={{
        marginBottom: isMobile ? '12px' : '24px',
        padding: isMobile ? '10px 12px' : '14px 20px',
        backgroundColor: 'rgba(254, 252, 232, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          gap: isMobile ? '6px' : '10px',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle style={{
            color: '#d97706',
            flexShrink: 0,
            marginTop: '2px'
          }} size={isMobile ? 14 : 18} />
          <p style={{
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            color: '#92400e',
            lineHeight: '1.4',
            margin: 0
          }}>
            <strong>Disclaimer:</strong> This is an AI-generated analysis, not a medical diagnosis. Please consult a healthcare provider.
          </p>
        </div>
      </div>

      <div style={{
        border: '1px solid #e2e8f0',
        padding: isMobile ? '16px' : '32px',
        marginBottom: isMobile ? '12px' : '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ color: '#1e293b' }}>
          {formatText(analysis)}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: isMobile ? '12px' : '24px'
      }}>
        <button
          onClick={downloadPDF}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '6px' : '10px',
            padding: isMobile ? '10px 20px' : '12px 28px',
            backgroundColor: '#0d9db8',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: isMobile ? '0.8125rem' : '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 157, 184, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0a7a8f';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 157, 184, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0d9db8';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 157, 184, 0.3)';
          }}
        >
          <Download size={isMobile ? 16 : 18} />
          Download Report as PDF
        </button>
      </div>

      <p style={{
        textAlign: 'center',
        fontSize: isMobile ? '0.6875rem' : '0.8125rem',
        color: '#94a3b8',
        marginTop: isMobile ? '12px' : '20px'
      }}>
        🔒 Your data is processed securely and not stored permanently
      </p>
    </div>
  );
};

export default LabResult;