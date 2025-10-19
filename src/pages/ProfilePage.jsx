// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import auth and db from your firebase.js
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// --- CSS Styles as JavaScript Objects ---

const styles = {
  profileContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  h2Style: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '1.5rem',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  profileDetail: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #eee',
  },
  strongStyle: {
    display: 'block',
    color: '#555',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  pStyle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#222',
  },
  loadingErrorStyle: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '3rem',
    color: '#777',
  },
};
// ----------------------------------------


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, fetch their data
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("No user data found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // User is not logged in
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={styles.loadingErrorStyle}>Loading profile...</div>;
  }

  if (!userData) {
    return <div style={styles.loadingErrorStyle}>Please log in to view your profile.</div>;
  }

  // --- Render Profile ---
  return (
    <div style={styles.profileContainer}>
      <h2 style={styles.h2Style}>My Profile</h2>
      <div style={styles.profileCard}>
        <div style={styles.profileDetail}>
          <strong style={styles.strongStyle}>Name:</strong>
          <p style={styles.pStyle}>{userData.name || 'N/A'}</p>
        </div>
        <div style={styles.profileDetail}>
          <strong style={styles.strongStyle}>Email:</strong>
          <p style={styles.pStyle}>{userData.email || 'N/A'}</p>
        </div>
        {/* Add any other user details you want to display */}
      </div>
    </div>
  );
};

export default ProfilePage;