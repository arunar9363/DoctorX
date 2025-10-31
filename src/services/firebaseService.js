import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

// ===== SAVED DISEASES =====

/**
 * Save a disease to user's collection with complete details
 */
export const saveDiseaseToFirebase = async (diseaseData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const diseaseId = diseaseData.slug || diseaseData.name.toLowerCase().replace(/\s+/g, '-');
    const diseaseRef = doc(db, 'savedDiseases', user.uid, 'diseases', diseaseId);

    const diseaseToSave = {
      // Basic Information
      diseaseName: diseaseData.name,
      diseaseSlug: diseaseId,
      category: diseaseData.category || 'General',
      description: diseaseData.description || '',
      severity: diseaseData.severity || 'Unknown',
      duration: diseaseData.duration || 'Variable',
      contagious: diseaseData.contagious || false,
      
      // Overview Details
      affectedPopulation: diseaseData.affectedPopulation || 'Not specified',
      geographicSpread: diseaseData.geographicSpread || 'Not specified',
      onsetPeriod: diseaseData.onsetPeriod || 'Variable',
      additionalInfo: diseaseData.additionalInfo || '',
      
      // Symptoms
      symptoms: diseaseData.symptoms || [],
      stages: diseaseData.stages || [], // Array of {name, description}
      
      // Treatment
      treatment: diseaseData.treatment || [],
      medications: diseaseData.medications || [], // Array of {name, dosage, description}
      
      // Prevention
      prevention: diseaseData.prevention || [],
      vaccineInfo: diseaseData.vaccineInfo || null, // {available, name, schedule, effectiveness}
      
      // Metadata
      image: diseaseData.image || '',
      savedAt: Timestamp.now(),
      notes: diseaseData.notes || ''
    };

    await setDoc(diseaseRef, diseaseToSave);
    return { success: true, diseaseId };
  } catch (error) {
    console.error('Error saving disease:', error);
    throw error;
  }
};

/**
 * Get all saved diseases for current user
 */
export const getSavedDiseases = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const diseasesRef = collection(db, 'savedDiseases', user.uid, 'diseases');
    const q = query(diseasesRef, orderBy('savedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const diseases = [];
    querySnapshot.forEach((doc) => {
      diseases.push({
        id: doc.id,
        ...doc.data(),
        savedAt: doc.data().savedAt?.toDate()
      });
    });

    return diseases;
  } catch (error) {
    console.error('Error getting saved diseases:', error);
    throw error;
  }
};

/**
 * Get a single saved disease by slug
 */
export const getSavedDiseaseById = async (diseaseSlug) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const diseaseRef = doc(db, 'savedDiseases', user.uid, 'diseases', diseaseSlug);
    const diseaseDoc = await getDoc(diseaseRef);

    if (!diseaseDoc.exists()) {
      return null;
    }

    return {
      id: diseaseDoc.id,
      ...diseaseDoc.data(),
      savedAt: diseaseDoc.data().savedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting saved disease:', error);
    throw error;
  }
};

/**
 * Check if a disease is already saved
 */
export const isDiseaseAlreadySaved = async (diseaseSlug) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const diseaseRef = doc(db, 'savedDiseases', user.uid, 'diseases', diseaseSlug);
    const diseaseDoc = await getDoc(diseaseRef);
    
    return diseaseDoc.exists();
  } catch (error) {
    console.error('Error checking disease:', error);
    return false;
  }
};

/**
 * Update notes for a saved disease
 */
export const updateDiseaseNotes = async (diseaseSlug, notes) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const diseaseRef = doc(db, 'savedDiseases', user.uid, 'diseases', diseaseSlug);
    await setDoc(diseaseRef, { notes, updatedAt: Timestamp.now() }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating disease notes:', error);
    throw error;
  }
};

/**
 * Remove a saved disease
 */
export const removeSavedDisease = async (diseaseId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const diseaseRef = doc(db, 'savedDiseases', user.uid, 'diseases', diseaseId);
    await deleteDoc(diseaseRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing disease:', error);
    throw error;
  }
};

/**
 * Get disease statistics for user
 */
export const getSavedDiseasesStats = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const diseases = await getSavedDiseases();
    
    return {
      totalSaved: diseases.length,
      byCategory: diseases.reduce((acc, disease) => {
        acc[disease.category] = (acc[disease.category] || 0) + 1;
        return acc;
      }, {}),
      contagiousCount: diseases.filter(d => d.contagious).length,
      recentlySaved: diseases.slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting disease stats:', error);
    throw error;
  }
};

// ===== ASSESSMENT HISTORY =====

/**
 * Save assessment result to Firebase
 */
export const saveAssessmentToFirebase = async (assessmentData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const assessmentId = `assessment_${Date.now()}`;
    const assessmentRef = doc(db, 'assessmentHistory', user.uid, 'assessments', assessmentId);

    const assessmentToSave = {
      patientName: assessmentData.patientName || 'Anonymous',
      age: assessmentData.age || 0,
      sex: assessmentData.sex || 'male',
      symptoms: assessmentData.symptoms || [],
      conditions: assessmentData.conditions || [],
      triageLevel: assessmentData.triageLevel || 'self_care',
      triageDescription: assessmentData.triageDescription || '',
      recommendations: assessmentData.recommendations || [],
      completedAt: Timestamp.now(),
      evidenceCount: assessmentData.evidenceCount || 0
    };

    await setDoc(assessmentRef, assessmentToSave);
    return { success: true, assessmentId };
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
};

/**
 * Get all assessments for current user
 */
export const getAssessmentHistory = async (limitCount = 50) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const assessmentsRef = collection(db, 'assessmentHistory', user.uid, 'assessments');
    const q = query(assessmentsRef, orderBy('completedAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const assessments = [];
    querySnapshot.forEach((doc) => {
      assessments.push({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate()
      });
    });

    return assessments;
  } catch (error) {
    console.error('Error getting assessment history:', error);
    throw error;
  }
};

/**
 * Get a single assessment by ID
 */
export const getAssessmentById = async (assessmentId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const assessmentRef = doc(db, 'assessmentHistory', user.uid, 'assessments', assessmentId);
    const assessmentDoc = await getDoc(assessmentRef);

    if (!assessmentDoc.exists()) {
      throw new Error('Assessment not found');
    }

    return {
      id: assessmentDoc.id,
      ...assessmentDoc.data(),
      completedAt: assessmentDoc.data().completedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting assessment:', error);
    throw error;
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (assessmentId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const assessmentRef = doc(db, 'assessmentHistory', user.uid, 'assessments', assessmentId);
    await deleteDoc(assessmentRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
};

/**
 * Get assessment statistics
 */
export const getAssessmentStats = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const assessments = await getAssessmentHistory();
    
    return {
      totalAssessments: assessments.length,
      lastAssessment: assessments[0]?.completedAt || null,
      triageLevels: assessments.reduce((acc, assessment) => {
        acc[assessment.triageLevel] = (acc[assessment.triageLevel] || 0) + 1;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting assessment stats:', error);
    throw error;
  }
};