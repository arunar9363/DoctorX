import React, { useState } from 'react';
import { Upload, Activity, FileText, AlertCircle } from 'lucide-react';
import LabResult from './LabResult';

const LabUpload = () => {
  const [file, setFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");
      setAnalysisData(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/medical-analysis", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.error) {
        setError("Server Error: " + data.error);
      } else if (data.analysis) {
        console.log("Setting analysis data:", data.analysis);
        setAnalysisData(data.analysis);
      } else {
        console.log("No analysis in response");
        setError("No analysis data received from server");
      }
    } catch (err) {
      setError("Connection Failed: Make sure Python Backend is running.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      paddingTop: isMobile ? '60px' : '100px',
      minHeight: '100vh',
      background: 'var(--bg-gradient, linear-gradient(180deg, #ffffff 0%, #d1f4f9 100%))',
      paddingBottom: isMobile ? '30px' : '60px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 24px' }}>
        <div style={{ marginBottom: isMobile ? '24px' : '48px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '8px' : '12px', marginBottom: isMobile ? '12px' : '24px' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              padding: isMobile ? '10px' : '16px',
              borderRadius: '50%',
              display: 'inline-flex'
            }}>
              <Activity style={{ color: '#2563eb', width: isMobile ? '28px' : '40px', height: isMobile ? '28px' : '40px' }} />
            </div>
          </div>
          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '2.2rem',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: isMobile ? '8px' : '16px',
            lineHeight: '1.2'
          }}>
            AI Lab Report & Imaging Analysis
          </h2>
          <p style={{
            color: '#475569',
            fontSize: isMobile ? '0.8125rem' : '1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5',
            padding: isMobile ? '0 8px' : '0'
          }}>
            Upload your Lab Report (PDF) or X-Ray/MRI (Image) to detect potential Red Flags using advanced AI technology.
          </p>
        </div>

        <div style={{
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '20px' : '40px',
          marginBottom: isMobile ? '20px' : '40px'
        }}>
          <div style={{
            border: file ? '2px dashed #4ade80' : '2px dashed #93c5fd',
            backgroundColor: file ? '#f0fdf4' : 'transparent',
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? '32px 16px' : '64px 32px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              id="lab-file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="lab-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {file ? (
                <>
                  <FileText style={{ width: isMobile ? '40px' : '64px', height: isMobile ? '40px' : '64px', color: '#16a34a', marginBottom: isMobile ? '10px' : '16px' }} />
                  <span style={{ color: '#166534', fontWeight: '600', fontSize: isMobile ? '0.9375rem' : '1.25rem', marginBottom: isMobile ? '6px' : '8px', display: 'block', wordBreak: 'break-word', padding: '0 8px' }}>
                    {file.name}
                  </span>
                  <span style={{ color: '#16a34a', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Click to change file</span>
                </>
              ) : (
                <>
                  <Upload style={{ width: isMobile ? '40px' : '64px', height: isMobile ? '40px' : '64px', color: '#3b82f6', marginBottom: isMobile ? '10px' : '16px' }} />
                  <span style={{ color: '#334155', fontWeight: '600', fontSize: isMobile ? '0.9375rem' : '1.25rem', marginBottom: isMobile ? '6px' : '8px', display: 'block' }}>
                    Click to Upload Report or Image
                  </span>
                  <span style={{ color: '#64748b', fontSize: isMobile ? '0.75rem' : '1rem' }}>Supports PDF, JPG, PNG (Max 5MB)</span>
                </>
              )}
            </label>
          </div>

          {error && (
            <div style={{
              marginTop: isMobile ? '12px' : '24px',
              padding: isMobile ? '12px 14px' : '16px 20px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: isMobile ? '12px' : '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: isMobile ? '8px' : '12px'
            }}>
              <AlertCircle size={isMobile ? 16 : 20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontWeight: '500', fontSize: isMobile ? '0.8125rem' : '1rem' }}>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            style={{
              width: '100%',
              marginTop: isMobile ? '16px' : '32px',
              padding: isMobile ? '14px' : '20px',
              borderRadius: isMobile ? '10px' : '12px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: isMobile ? '0.875rem' : '1.125rem',
              boxShadow: loading || !file ? 'none' : '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px',
              border: 'none',
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              background: loading || !file
                ? '#cbd5e1'
                : 'linear-gradient(to right, #2563eb, #1d4ed8)',
            }}
            onMouseEnter={(e) => {
              if (!loading && file) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 99, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = loading || !file ? 'none' : '0 10px 15px -3px rgba(37, 99, 235, 0.3)';
            }}
          >
            {loading ? (
              <>
                <Activity size={isMobile ? 16 : 20} className="animate-spin" />
                Processing Analysis...
              </>
            ) : (
              <>
                <Activity size={isMobile ? 16 : 20} />
                Analyze Now
              </>
            )}
          </button>

          <div style={{ marginTop: isMobile ? '12px' : '24px', textAlign: 'center' }}>
            <p style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#64748b' }}>
              <span style={{ fontWeight: '600' }}>Secure & Private:</span> Your data is processed securely and not stored permanently.
            </p>
          </div>
        </div>

        {analysisData && (
          <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
            <LabResult analysis={analysisData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LabUpload;