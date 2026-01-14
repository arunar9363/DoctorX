import React from 'react';

const UnderDevelopment = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Simple Icon or Emoji */}
      <div style={{ fontSize: '50px', marginBottom: '20px' }}>⏳</div>

      <h2 style={{ color: '#0d9db8', marginBottom: '10px' }}>
        Coming Soon!
      </h2>

      <p style={{ color: '#555', maxWidth: '400px', lineHeight: '1.6' }}>
        This feature is currently in the development phase.
        We are working with our medical advisor to ensure clinical accuracy.
      </p>

      {/* Simple CSS Spinner */}
      <div className="spinner" style={{
        marginTop: '30px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #0d9db8',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite'
      }}></div>

      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};

export default UnderDevelopment;