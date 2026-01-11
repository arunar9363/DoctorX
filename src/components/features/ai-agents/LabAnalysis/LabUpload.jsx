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
      // Basic validation
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");
      setAnalysisData(null); // Reset old results
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
      // Backend API Call
      // Remove the domain. Vercel will automatically route this to your backend.
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

  return (
    <div style={{
      paddingTop: '100px',
      minHeight: '100vh',
      // We use 'background' instead of 'backgroundColor' to support gradients
      background: 'var(--bg-gradient, linear-gradient(180deg, #ffffff 0%, #d1f4f9 100%))',
      paddingBottom: '60px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              padding: '16px',
              borderRadius: '50%',
              display: 'inline-flex'
            }}>
              <Activity style={{ color: '#2563eb', width: '40px', height: '40px' }} />
            </div>
          </div>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            AI Lab Report & Imaging Analysis
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Upload your Lab Report (PDF) or X-Ray/MRI (Image) to detect potential Red Flags using advanced AI technology.
          </p>
        </div>

        {/* Upload Box */}
        <div style={{
         
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <div style={{
            border: file ? '2px dashed #4ade80' : '2px dashed #93c5fd',
            backgroundColor: file ? '#f0fdf4' : 'transparent',
            borderRadius: '16px',
            padding: '64px 32px',
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
            <label htmlFor="lab-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              {file ? (
                <>
                  <FileText style={{ width: '64px', height: '64px', color: '#16a34a', marginBottom: '16px' }} />
                  <span style={{ color: '#166534', fontWeight: '600', fontSize: '1.25rem', marginBottom: '8px', display: 'block' }}>
                    {file.name}
                  </span>
                  <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>Click to change file</span>
                </>
              ) : (
                <>
                  <Upload style={{ width: '64px', height: '64px', color: '#3b82f6', marginBottom: '16px' }} />
                  <span style={{ color: '#334155', fontWeight: '600', fontSize: '1.25rem', marginBottom: '8px', display: 'block' }}>
                    Click to Upload Report or Image
                  </span>
                  <span style={{ color: '#64748b', fontSize: '1rem' }}>Supports PDF, JPG, PNG (Max 5MB)</span>
                </>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '24px',
              padding: '16px 20px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            style={{
              width: '100%',
              marginTop: '32px',
              padding: '20px',
              borderRadius: '12px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1.125rem',
              boxShadow: loading || !file ? 'none' : '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
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
                <Activity size={20} className="animate-spin" />
                Processing Analysis...
              </>
            ) : (
              <>
                <Activity size={20} />
                Analyze Now
              </>
            )}
          </button>

          {/* Info Text */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              <span style={{ fontWeight: '600' }}>Secure & Private:</span> Your data is processed securely and not stored permanently.
            </p>
          </div>
        </div>

        {/* Result Section (Displays only when data is available) */}
        {analysisData && (
          <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
            <LabResult analysis={analysisData} />
          </div>
        )}

        {/* Debug info - Remove after testing */}
        {analysisData && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#0369a1'
          }}>
            <strong>Debug:</strong> Analysis data received - {typeof analysisData} - Length: {analysisData?.length || 'N/A'}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabUpload;