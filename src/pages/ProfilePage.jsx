import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import profileImage from '/assets/profile.jpg';

const ProfilePage = ({ show, onClose, onShowToast }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showEditPrompt, setShowEditPrompt] = useState(false);

  useEffect(() => {
    // Check theme
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');
  }, [show]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data);
            setEditedData(data);

            // Check if name is empty and show edit prompt
            if (!data.name || data.name.trim() === '') {
              setShowEditPrompt(true);
            }
          } else {
            console.log("No user data found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name) => {
    if (!name || name.trim() === '') return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowEditPrompt(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = async () => {
    // Validate that name is not empty
    if (!editedData.name || editedData.name.trim() === '') {
      if (onShowToast) {
        onShowToast('Please enter your name before saving.', 'error');
      }
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, editedData);
      setUserData(editedData);
      setIsEditing(false);
      setShowEditPrompt(false);
      if (onShowToast) {
        onShowToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (onShowToast) {
        onShowToast('Failed to update profile. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isEditing) {
      onClose();
    }
  };

  if (!show) return null;

  // Inline Styles with CSS Variables
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(8px)',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  };

  const modalStyle = {
    background: isDark
      ? 'linear-gradient(135deg, var(--color-primary), #1a1a1a)'
      : 'linear-gradient(135deg, var(--color-primary), #f8f9fa)',
    padding: '2rem',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '850px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: isDark
      ? '0 20px 60px rgba(0, 0, 0, 0.5)'
      : '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    color: 'var(--color-dark)',
    position: 'relative',
    animation: 'fadeInScale 0.3s ease-in-out',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    margin: 'auto',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    border: 'none',
    fontSize: '1.5rem',
    color: 'var(--color-dark)',
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'all 0.3s ease',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    zIndex: 10,
  };

  const titleStyle = {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    fontWeight: 700,
    color: 'var(--color-secondary)',
    textAlign: 'center',
    marginTop: '0.5rem',
  };

  const profileHeaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 0 32px',
    borderBottom: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
  };

  const avatarWrapperStyle = {
    position: 'relative',
    marginBottom: '20px',
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid var(--color-secondary)',
    boxShadow: '0 8px 24px rgba(13, 157, 184, 0.3)',
  };

  const avatarInitialsStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-third))',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 700,
    color: '#ffffff',
    border: '4px solid var(--color-secondary)',
    boxShadow: '0 8px 24px rgba(13, 157, 184, 0.3)',
  };

  const cameraIconStyle = {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--color-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: isDark ? '3px solid var(--color-primary)' : '3px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-dark)',
    marginBottom: '8px',
    textAlign: 'center',
  };

  const editPromptStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-secondary)',
    marginBottom: '8px',
    textAlign: 'center',
    animation: 'pulse 2s ease-in-out infinite',
  };

  const emailStyle = {
    fontSize: '15px',
    color: isDark ? 'rgba(229, 231, 235, 0.7)' : 'rgba(26, 26, 26, 0.7)',
    fontWeight: '400',
    textAlign: 'center',
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-secondary)',
    marginBottom: '24px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textAlign: 'left',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
    gap: '20px',
    marginBottom: '24px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: isDark ? 'rgba(229, 231, 235, 0.8)' : 'rgba(26, 26, 26, 0.8)',
  };

  const inputStyle = {
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-dark)',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: isDark
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e5e7eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1a1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    cursor: 'pointer',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  };

  const readOnlyValueStyle = {
    ...inputStyle,
    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
    cursor: 'not-allowed',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
  };

  const buttonBaseStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit',
  };

  const editButtonStyle = {
    ...buttonBaseStyle,
    background: 'var(--color-secondary)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(13, 157, 184, 0.3)',
  };

  const cancelButtonStyle = {
    ...buttonBaseStyle,
    background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    color: 'var(--color-dark)',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(0, 0, 0, 0.2)',
  };

  const saveButtonStyle = {
    ...buttonBaseStyle,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    opacity: saving ? 0.6 : 1,
    cursor: saving ? 'not-allowed' : 'pointer',
  };

  const loadingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: 'var(--color-dark)',
    fontSize: '18px',
    fontFamily: '"Inter", sans-serif',
  };

  const spinnerStyle = {
    width: '60px',
    height: '60px',
    border: isDark
      ? '4px solid rgba(255, 255, 255, 0.1)'
      : '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid var(--color-secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '24px',
  };

  const alertBannerStyle = {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  };

  if (loading) {
    return (
      <div style={overlayStyle} onClick={handleOverlayClick}>
        <div style={modalStyle}>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
            `}
          </style>
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <div>Loading your profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={overlayStyle} onClick={handleOverlayClick}>
        <div style={modalStyle}>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
          <div style={loadingStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <div>Please log in to view your profile.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .profile-modal::-webkit-scrollbar {
            width: 8px;
          }
          
          .profile-modal::-webkit-scrollbar-track {
            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            border-radius: 10px;
          }
          
          .profile-modal::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, var(--color-secondary), var(--color-third));
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          
          .profile-modal::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, var(--color-third), var(--color-secondary));
          }
          
          .profile-modal {
            scrollbar-width: thin;
            scrollbar-color: var(--color-secondary) ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          }
          
          .profile-modal input:focus,
          .profile-modal select:focus,
          .profile-modal textarea:focus {
            background: ${isDark ? 'rgba(13, 157, 184, 0.1)' : 'rgba(13, 157, 184, 0.05)'} !important;
            border-color: var(--color-secondary) !important;
            box-shadow: 0 0 0 2px rgba(13, 157, 184, 0.15) !important;
          }
          
          .profile-modal input::placeholder,
          .profile-modal textarea::placeholder {
            color: ${isDark ? 'rgba(229, 231, 235, 0.5)' : 'rgba(26, 26, 26, 0.5)'};
          }
          
          .profile-close-btn:hover {
            background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
            transform: scale(1.1);
          }
          
          .profile-camera-icon:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(13, 157, 184, 0.6);
            background: var(--color-third) !important;
          }
          
          .profile-btn-edit:hover:not(:disabled) {
            background: var(--color-third) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(13, 157, 184, 0.4);
          }
          
          .profile-btn-cancel:hover:not(:disabled) {
            background: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'} !important;
          }
          
          .profile-btn-save:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          }
          
          @media (max-width: 768px) {
            .profile-form-grid {
              grid-template-columns: 1fr !important;
            }
            .profile-action-buttons {
              flex-direction: column-reverse;
            }
            .profile-action-buttons button {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>

      <div style={overlayStyle} onClick={handleOverlayClick}>
        <div style={modalStyle} className="profile-modal">
          <button
            className="profile-close-btn"
            style={closeButtonStyle}
            onClick={onClose}
          >
            ✕
          </button>

          <h2 style={titleStyle}>Account Details</h2>

          {/* Alert Banner for incomplete profile */}
          {showEditPrompt && (
            <div style={alertBannerStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Please complete your profile by adding your name and other details.</span>
            </div>
          )}

          {/* Profile Header with Avatar */}
          <div style={profileHeaderStyle}>
            <div style={avatarWrapperStyle}>
              <img
                src={profileImage}
                alt={userData.name || 'User'}
                style={avatarStyle}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={avatarInitialsStyle}>
                {getInitials(userData.name)}
              </div>
              <div
                className="profile-camera-icon"
                style={cameraIconStyle}
                title="Click to change photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            {(!userData.name || userData.name.trim() === '') ? (
              <h1 style={editPromptStyle}>✏️ Edit Profile</h1>
            ) : (
              <h1 style={nameStyle}>{userData.name}</h1>
            )}
            <p style={emailStyle}>{userData.email || 'No email provided'}</p>
          </div>

          {/* Health History Section - Moved to top */}
          <div style={{
            padding: '24px',
            background: isDark ? 'rgba(13, 157, 184, 0.1)' : 'rgba(13, 157, 184, 0.05)',
            borderRadius: '12px',
            marginBottom: '32px',
            borderLeft: '4px solid var(--color-secondary)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-secondary)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Health History
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: isDark ? '#9ca3af' : '#6b7280',
              marginBottom: '16px'
            }}>
              View your saved diseases and assessment history
            </p>
            <button
              onClick={() => window.location.href = '/history'}
              style={{
                background: 'var(--color-secondary)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--color-third)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--color-secondary)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              View History
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Form Section */}
          <div>
            <h3 style={sectionTitleStyle}>Personal Information</h3>

            <div className="profile-form-grid" style={formGridStyle}>
              {/* Full Name */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={inputStyle}
                    value={editedData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div style={readOnlyValueStyle}>{userData.name || 'Not set - Click Edit to add'}</div>
                )}
              </div>

              {/* Email */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>E-Mail *</label>
                <div style={readOnlyValueStyle}>{userData.email || 'N/A'}</div>
              </div>

              {/* Date of Birth */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    style={inputStyle}
                    value={editedData.dob || ''}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                  />
                ) : (
                  <div style={readOnlyValueStyle}>{formatDate(userData.dob)}</div>
                )}
              </div>

              {/* Gender */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Gender</label>
                {isEditing ? (
                  <select
                    style={selectStyle}
                    value={editedData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div style={readOnlyValueStyle}>{userData.gender || 'N/A'}</div>
                )}
              </div>

              {/* Blood Group */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Blood Group</label>
                {isEditing ? (
                  <select
                    style={selectStyle}
                    value={editedData.bloodGroup || ''}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                ) : (
                  <div style={readOnlyValueStyle}>{userData.bloodGroup || 'N/A'}</div>
                )}
              </div>

              {/* City */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>City / Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={inputStyle}
                    value={editedData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g., Mumbai, Delhi"
                  />
                ) : (
                  <div style={readOnlyValueStyle}>{userData.city || 'N/A'}</div>
                )}
              </div>

              {/* Medical Conditions - Full Width */}
              <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Existing Medical Conditions</label>
                {isEditing ? (
                  <textarea
                    style={textareaStyle}
                    value={editedData.existingConditions || ''}
                    onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                    placeholder="Enter any existing medical conditions..."
                  />
                ) : (
                  <div style={readOnlyValueStyle}>
                    {userData.existingConditions || 'None reported'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-action-buttons" style={actionButtonsStyle}>
            {isEditing ? (
              <>
                <button
                  className="profile-btn-cancel"
                  style={cancelButtonStyle}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="profile-btn-save"
                  style={saveButtonStyle}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                className="profile-btn-edit"
                style={editButtonStyle}
                onClick={handleEdit}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;