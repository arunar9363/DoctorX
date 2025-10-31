import React, { useState, useEffect } from "react";
import { saveAssessmentToFirebase } from '../../services/firebaseService';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const styles = {
  root: {
    fontFamily: "'Merriweather', serif",
    background: "linear-gradient(135deg, var(--color-fourth) 0%, #f8fdfe 50%, var(--color-primary) 100%)",
    color: "var(--color-dark, #1a1a1a)",
    minHeight: "100vh",
    marginTop: "50px",
    padding: 20,
    boxSizing: "border-box",
    animation: "fadeInUp 0.8s ease-out",
  },
  rootDark: {
    background: "linear-gradient(135deg, var(--color-fourth) 0%, #0f172a 50%, var(--color-primary) 100%)",
    color: "var(--color-light, #e5e7eb)",
  },
  mainTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "var(--color-secondary)",
    marginBottom: 30,
    fontFamily: "'Merriweather', serif",
    animation: "slideInFromTop 0.8s ease-out 0.2s both",
  },
  card: {
    borderRadius: 12,
    padding: 30,
    maxWidth: 900,
    margin: "12px auto",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    animation: "fadeInScale 0.8s ease-out 0.4s both",
    color: "var(--color-dark, #1a1a1a)",
  },
  left: {
    width: "100%",
  },
  rightImg: {
    width: 180,
    height: "auto",
    alignSelf: "center",
  },
  header: {
    textAlign: "left",
    marginBottom: 20,
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--color-secondary)",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: "1rem",
    color: "var(--color-text-secondary, #666666)",
    opacity: 0.9,
    lineHeight: 1.5,
  },
  field: { marginBottom: 16 },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "var(--color-text-primary, #1a1a1a)",
    fontSize: "0.95rem"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "16px",
    background: "rgba(107, 114, 128, 0.1)",
    color: "var(--color-text-primary, #1a1a1a)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
  },
  darkInput: {
    background: "rgba(55, 65, 81, 0.8)",
    color: "#e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  },
  darkCard: {
    background: "rgba(15, 23, 42, 0.9)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    color: "#e5e7eb",
  },
  darkConditionItem: {
    background: "rgba(31, 41, 55, 0.8)",
    border: "1px solid rgba(13,157,184,0.2)",
    color: "#e5e7eb",
  },
  darkQuestionCard: {
    background: "rgba(31, 41, 55, 0.6)",
    border: "1px solid rgba(13,157,184,0.3)",
    color: "#e5e7eb",
  },
  darkSubtitle: {
    color: "#9ca3af",
  },
  darkLabel: {
    color: "#e5e7eb",
  },
  darkText: {
    color: "#e5e7eb",
  },
  btnPrimary: {
    background: "var(--color-secondary, #0d9db8)",
    color: "var(--color-primary, #ffffff)",
    border: "none",
    padding: "14px 24px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  btnGhost: {
    background: "transparent",
    color: "var(--color-text-primary, #1a1a1a)",
    border: "1px solid rgba(13, 157, 184, 0.3)",
    padding: "12px 20px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },
  btnGhostDark: {
    color: "#e5e7eb",
    border: "1px solid rgba(13, 157, 184, 0.5)",
  },
  feedbackButton: {
    background: "rgba(13, 157, 184, 0.1)",
    color: "var(--color-secondary)",
    border: "1px solid var(--color-secondary)",
    padding: "12px 20px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    margin: "20px auto",
    display: "block",
    textAlign: "center",
    textDecoration: "none",
  },
  symptomChip: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(13,157,184,0.1)",
    color: "var(--color-secondary, #0d9db8)",
    padding: "6px 12px",
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    fontSize: "0.9rem",
    border: "1px solid rgba(13,157,184,0.2)",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    marginLeft: 8,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionCard: {
    background: "rgba(13,157,184,0.05)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    border: "1px solid rgba(13,157,184,0.2)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  choiceButton: {
    background: "var(--color-primary, #ffffff)",
    border: "1px solid rgba(13,157,184,0.3)",
    padding: "10px 18px",
    borderRadius: 10,
    margin: "4px 8px 4px 0",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.95rem",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  choiceButtonDark: {
    background: "rgba(55, 65, 81, 0.8)",
    color: "#e5e7eb",
    border: "1px solid rgba(13,157,184,0.5)",
  },
  conditionItem: {
    background: "rgba(255, 255, 255, 0.6)",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    border: "1px solid rgba(13,157,184,0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  errorBox: {
    background: "#fee",
    color: "#c00",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    border: "1px solid #fcc",
  },
  errorBoxDark: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  warningBox: {
    background: "#fff3cd",
    color: "#856404",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    border: "1px solid #ffeaa7",
  },
  warningBoxDark: {
    background: "rgba(245, 158, 11, 0.1)",
    color: "#fcd34d",
    border: "1px solid rgba(245, 158, 11, 0.3)",
  },
  loaderContainer: {
    textAlign: 'center'
  },
  loader: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'inline-block',
    borderTop: '4px solid var(--color-secondary)',
    borderRight: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '4px solid transparent',
    boxSizing: 'border-box',
    animation: 'rotation 1s linear infinite',
    position: 'relative'
  },
  loaderAfter: {
    content: "''",
    boxSizing: 'border-box',
    position: 'absolute',
    left: '0',
    top: '0',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    borderLeft: '4px solid var(--color-third)',
    borderBottom: '4px solid transparent',
    borderTop: '4px solid transparent',
    borderRight: '4px solid transparent',
    animation: 'rotation 0.5s linear infinite reverse'
  },
  searchResultsContainer: {
    marginBottom: 16,
    maxHeight: 200,
    overflowY: "auto",
    border: "1px solid rgba(13,157,184,0.2)",
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
  searchResultsContainerDark: {
    background: "rgba(31, 41, 55, 0.8)",
    border: "1px solid rgba(13,157,184,0.3)",
  },
  searchResultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottom: "1px solid rgba(13,157,184,0.1)",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  searchResultItemDark: {
    color: "#e5e7eb",
    borderBottom: "1px solid rgba(13,157,184,0.2)",
  },
  searchResultName: {
    fontWeight: "bold",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  searchResultNameDark: {
    color: "#e5e7eb",
  },
  searchResultCommonName: {
    fontSize: 12,
    color: "#666",
  },
  searchResultCommonNameDark: {
    color: "#9ca3af",
  },
  infoBox: {
    background: "rgba(13,157,184,0.05)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeft: "4px solid var(--color-secondary, #0d9db8)",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  infoBoxDark: {
    background: "rgba(13,157,184,0.1)",
    color: "#e5e7eb",
  },
  disclaimerBox: {
    marginTop: 20,
    padding: 12,
    background: "#fff3cd",
    borderRadius: 8,
    fontSize: 12,
    color: "#856404",
  },
  disclaimerBoxDark: {
    background: "rgba(245, 158, 11, 0.1)",
    color: "#fcd34d",
  },
  careRecommendations: {
    background: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    border: "1px solid #e9ecef",
    color: "#1a1a1a",
  },
  careRecommendationsDark: {
    background: "rgba(31, 41, 55, 0.6)",
    border: "1px solid rgba(13,157,184,0.2)",
    color: "#e5e7eb",
  },
  takeCareMessage: {
    background: "linear-gradient(135deg, rgba(13,157,184,0.1), rgba(13,157,184,0.05))",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    border: "1px solid rgba(13,157,184,0.2)",
    color: "var(--color-text-primary, #1a1a1a)",
  },
  takeCareMessageDark: {
    background: "linear-gradient(135deg, rgba(13,157,184,0.15), rgba(13,157,184,0.08))",
    border: "1px solid rgba(13,157,184,0.3)",
    color: "#e5e7eb",
  }
};

export default function InfermedicaTriageSymptomChecker({
  // eslint-disable-next-line no-undef
  apiBaseUrl = process.env.NODE_ENV === 'production' ? "/api" : "/api", // Use relative URLs for both
}) {
  // Patient info state
  const [step, setStep] = useState(0);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: 18,
    sex: "male",
  });

  // UI state
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Symptoms and evidence state
  const [symptoms, setSymptoms] = useState([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]); // Cache all symptoms

  // Diagnosis flow state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [maxQuestions] = useState(18); // Limit to 15-20 questions for better accuracy

  // Authentication and save states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSavingAssessment, setIsSavingAssessment] = useState(false);
  const [assessmentSaved, setAssessmentSaved] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  // Check for dark theme and handle page loading
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Simulate page loading
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(loadingTimer);
    };
  }, []);

  // Load all symptoms on component mount
  useEffect(() => {
    if (!isPageLoading) {
      loadAllSymptoms();
    }
  }, [patientInfo.age, isPageLoading]);

  // API helper function with better error handling
  const apiCall = async (endpoint, options = {}) => {
    setError(null);
    try {
      console.log(`API Call: ${endpoint}`, options.body ? JSON.parse(options.body) : '');

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const responseText = await response.text();
      console.log(`API Response (${response.status}):`, responseText);

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid JSON response from server");
      }
    } catch (err) {
      const errorMessage = err.message || "Unknown API error";
      setError(errorMessage);
      console.error("API call failed:", err);
      throw err;
    }
  };

  // Load all symptoms for local filtering
  const loadAllSymptoms = async () => {
    try {
      const result = await apiCall(`/symptoms?age=${patientInfo.age}`);
      console.log("Loaded symptoms:", result.length);
      setAllSymptoms(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load symptoms:", err);
      // Fallback: use common symptoms if API fails
      setAllSymptoms([
        { id: "s_1193", name: "Headache", common_name: "Headache" },
        { id: "s_1394", name: "Fever", common_name: "Fever" },
        { id: "s_1988", name: "Cough", common_name: "Cough" },
        { id: "s_102", name: "Abdominal pain", common_name: "Stomach pain" },
        { id: "s_1398", name: "Fatigue", common_name: "Tiredness" }
      ]);
    }
  };

  // Search symptoms with local filtering and API suggest as fallback
  const searchSymptoms = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // First try local filtering of all symptoms
      const localResults = allSymptoms.filter(symptom =>
        symptom.name.toLowerCase().includes(query.toLowerCase()) ||
        (symptom.common_name && symptom.common_name.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 10);

      if (localResults.length > 0) {
        console.log("Using local search results:", localResults.length);
        setSearchResults(localResults);
        return;
      }

      // Fallback to API suggest endpoint if no local results
      console.log("No local results, trying API suggest...");

      const response = await fetch(`${apiBaseUrl}/symptoms?q=${encodeURIComponent(query)}&age=${patientInfo.age}`, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        const results = await response.json();
        console.log("API suggest results:", results.length);
        setSearchResults(Array.isArray(results) ? results : []);
      } else {
        throw new Error(`Search failed: ${response.status}`);
      }
    } catch (err) {
      console.error("Symptom search failed:", err);
      // Show available symptoms as fallback
      const fallbackResults = allSymptoms.slice(0, 10);
      setSearchResults(fallbackResults);
      setError("Search temporarily unavailable. Showing common symptoms.");
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (symptomSearch) {
        searchSymptoms(symptomSearch);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [symptomSearch, patientInfo.age, allSymptoms]);

  // Add symptom to evidence
  const addSymptom = (symptom) => {
    const newEvidenceItem = {
      id: symptom.id,
      choice_id: "present",
      source: "initial"
    };

    setEvidence(prev => {
      const filtered = prev.filter(e => e.id !== symptom.id);
      return [...filtered, newEvidenceItem];
    });

    setSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (!exists) {
        return [...prev, symptom];
      }
      return prev;
    });

    setSymptomSearch("");
    setSearchResults([]);
  };

  // Remove symptom from evidence
  const removeSymptom = (symptomId) => {
    setEvidence(prev => prev.filter(e => e.id !== symptomId));
    setSymptoms(prev => prev.filter(s => s.id !== symptomId));
  };

  // Start diagnosis flow with better validation
  const startDiagnosis = async () => {
    if (evidence.length === 0) {
      setError("Please add at least one symptom before starting diagnosis.");
      return;
    }

    setIsLoading(true);
    setQuestionCount(0);
    setError(null);

    try {
      const diagnosisPayload = {
        sex: patientInfo.sex,
        age: {
          value: parseInt(patientInfo.age),
          unit: "year" // Fixed: use "year" not "years"
        },
        evidence: evidence
      };

      console.log("Starting diagnosis with:", diagnosisPayload);
      const result = await apiCall("/diagnosis", {
        method: "POST",
        body: JSON.stringify(diagnosisPayload),
      });

      console.log("Diagnosis result:", result);

      // Check if we have questions
      if (result.question && result.question.text) {
        setCurrentQuestion(result.question);
        setConditions(result.conditions || []);
        setQuestionCount(1);
        setStep(2);
      } else if (result.conditions && result.conditions.length > 0) {
        // No questions but we have conditions
        setConditions(result.conditions);
        setFinalResult(result);
        setStep(3);
      } else {
        setError("No diagnosis results received. This might indicate an issue with the selected symptoms.");
        // Still proceed to show what we have
        setConditions([]);
        setStep(3);
      }
    } catch (err) {
      console.error("Diagnosis failed:", err);
      setError(`Diagnosis failed: ${err.message}. Please try again with different symptoms.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Answer a diagnosis question
  const answerQuestion = async (answerId, choiceId) => {
    if (answerId === "skip") {
      return continueDialogue();
    }

    setIsLoading(true);
    setError(null);

    try {
      const newEvidenceItem = {
        id: answerId,
        choice_id: choiceId,
        source: "suggest"
      };

      const newEvidence = [...evidence, newEvidenceItem];
      setEvidence(newEvidence);

      await continueDialogue(newEvidence);
    } catch (err) {
      console.error("Question answering failed:", err);
      setError(`Failed to process answer: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Continue the diagnosis dialogue with question limit
  const continueDialogue = async (updatedEvidence = evidence) => {
    setIsLoading(true);
    setError(null);

    // Check if we've reached the question limit
    if (questionCount >= maxQuestions) {
      console.log(`Reached question limit (${maxQuestions}), proceeding to results`);
      setCurrentQuestion(null);
      setStep(3);
      setIsLoading(false);
      return;
    }

    try {
      const diagnosisPayload = {
        sex: patientInfo.sex,
        age: {
          value: parseInt(patientInfo.age),
          unit: "year"
        },
        evidence: updatedEvidence
      };

      console.log("Continuing diagnosis with:", diagnosisPayload);
      const result = await apiCall("/diagnosis", {
        method: "POST",
        body: JSON.stringify(diagnosisPayload),
      });

      console.log("Next diagnosis result:", result);

      if (result.question && result.question.text && questionCount < maxQuestions) {
        setCurrentQuestion(result.question);
        setConditions(result.conditions || []);
        setQuestionCount(prev => prev + 1);
      } else {
        // No more questions or reached limit, show final results
        setCurrentQuestion(null);
        setConditions(result.conditions || []);
        setFinalResult(result);
        setStep(3);
      }
    } catch (err) {
      console.error("Dialogue continuation failed:", err);
      setError(`Failed to continue: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get triage recommendation
  const getTriage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const triagePayload = {
        sex: patientInfo.sex,
        age: {
          value: parseInt(patientInfo.age),
          unit: "year" // Fixed: use "year" not "years"
        },
        evidence: evidence,
      };

      console.log("Getting triage with:", triagePayload);
      const result = await apiCall("/triage", {
        method: "POST",
        body: JSON.stringify(triagePayload),
      });

      console.log("Triage result:", result);
      setFinalResult(prev => ({ ...prev, triage: result }));
    } catch (err) {
      console.error("Triage failed:", err);
      setError(`Triage failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get care recommendations based on triage level
  const getCareRecommendations = (triageLevel) => {
    const recommendations = {
      'emergency': [
        "Go to the nearest emergency room immediately",
        "Do not drive yourself - call emergency services or have someone drive you",
        "Bring a list of your current medications",
        "Have someone accompany you if possible"
      ],
      'emergency_ambulance': [
        "Call 102 or emergency services immediately",
        "Do not attempt to drive or transport yourself",
        "Stay calm and follow dispatcher instructions",
        "Have your medical information ready if possible"
      ],
      'consultation_6': [
        "Contact your doctor or urgent care within 6 hours",
        "Monitor symptoms closely and seek immediate care if they worsen",
        "Avoid strenuous activities until evaluated",
        "Keep track of any new symptoms that develop"
      ],
      'consultation_24': [
        "Schedule an appointment with your healthcare provider within 24 hours",
        "Monitor your symptoms and note any changes",
        "Rest and stay hydrated",
        "Seek immediate care if symptoms worsen significantly"
      ],
      'consultation': [
        "Schedule a routine appointment with your healthcare provider",
        "Keep a symptom diary to discuss with your doctor",
        "Continue normal activities unless symptoms interfere",
        "Consider preventive measures relevant to your symptoms"
      ],
      'self_care': [
        "Monitor your symptoms at home",
        "Rest, stay hydrated, and maintain good nutrition",
        "Use appropriate over-the-counter remedies if needed",
        "Contact a healthcare provider if symptoms persist or worsen"
      ],
      'no_action': [
        "Continue your normal daily activities",
        "Maintain healthy lifestyle habits",
        "Stay aware of any symptom changes",
        "Consider routine preventive care"
      ]
    };

    return recommendations[triageLevel] || [
      "Follow up with a healthcare provider for proper evaluation",
      "Monitor your symptoms",
      "Seek care if symptoms change or worsen"
    ];
  };

  const getTriageDisplayText = (level) => {
    const triageTexts = {
      'emergency': 'Emergency Care Needed',
      'emergency_ambulance': 'Call Emergency Services (102)',
      'consultation_6': 'See Doctor Within 6 Hours',
      'consultation_24': 'See Doctor Within 24 Hours',
      'consultation': 'Schedule Doctor Visit',
      'self_care': 'Self-Care Recommended',
      'no_action': 'No Action Needed'
    };
    return triageTexts[level] || level || 'Assessment Complete';
  };

  const getTriageUrgency = (level) => {
    const urgencyTexts = {
      'emergency': 'URGENT: Go to emergency room immediately',
      'emergency_ambulance': 'CRITICAL: Call 102 or emergency services now',
      'consultation_6': 'HIGH PRIORITY: Seek medical attention within 6 hours',
      'consultation_24': 'MODERATE PRIORITY: Schedule appointment within 24 hours',
      'consultation': 'LOW PRIORITY: Schedule routine appointment',
      'self_care': 'Monitor symptoms and use home care methods',
      'no_action': 'Continue normal activities'
    };
    return urgencyTexts[level];
  };

  const getTriageColor = (level) => {
    const colors = {
      'emergency': '#fee2e2',
      'emergency_ambulance': '#fecaca',
      'consultation_6': '#fed7aa',
      'consultation_24': '#fef3c7',
      'consultation': '#d1fae5',
      'self_care': '#ecfccb',
      'no_action': '#f0f9ff'
    };
    return colors[level] || '#f3f4f6';
  };

  // Save assessment to Firebase
  const handleSaveAssessment = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save your assessment', 'error');
      return;
    }

    if (!finalResult) {
      showToast('Please Click on Get Core Recommendations, before saving.', 'error');
      return;
    }

    setIsSavingAssessment(true);

    try {
      const assessmentData = {
        patientName: patientInfo.name,
        age: patientInfo.age,
        sex: patientInfo.sex,
        symptoms: symptoms.map(s => s.name),
        conditions: conditions.map(c => ({
          name: c.name,
          probability: Math.round(c.probability * 100),
          commonName: c.common_name
        })),
        triageLevel: finalResult.triage?.triage_level || 'self_care',
        triageDescription: finalResult.triage?.description || '',
        recommendations: getCareRecommendations(finalResult.triage?.triage_level || 'self_care'),
        evidenceCount: evidence.length
      };

      await saveAssessmentToFirebase(assessmentData);
      setAssessmentSaved(true);
      showToast('Assessment saved successfully! View it in your History.', 'success');
    } catch (error) {
      console.error('Error saving assessment:', error);
      showToast('Failed to save assessment. Please try again.', 'error');
    } finally {
      setIsSavingAssessment(false);
    }
  };

  // Reset everything
  const reset = () => {
    setStep(0);
    setSymptoms([]);
    setEvidence([]);
    setCurrentQuestion(null);
    setConditions([]);
    setFinalResult(null);
    setError(null);
    setSymptomSearch("");
    setSearchResults([]);
    setQuestionCount(0);
    setAssessmentSaved(false);
  };

  // Helper function to get themed styles
  const getThemedStyle = (baseStyle, darkStyle = {}) => {
    return isDarkTheme ? { ...baseStyle, ...darkStyle } : baseStyle;
  };

  // Render patient info form
  const renderPatientForm = () => (
    <div>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Symptom Analyzer</div>
          <div style={getThemedStyle(styles.subtitle, styles.darkSubtitle)}>AI-powered symptom assessment for better health decisions.</div>
        </div>
      </div>

      <div style={styles.field}>
        <label style={getThemedStyle(styles.label, styles.darkLabel)}>Patient Name:</label>
        <input
          style={getThemedStyle(styles.input, styles.darkInput)}
          value={patientInfo.name}
          onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter patient name"
        />
      </div>
      <div style={styles.field}>
        <label style={getThemedStyle(styles.label, styles.darkLabel)}>Age:</label>
        <input
          type="number"
          style={getThemedStyle(styles.input, styles.darkInput)}
          value={patientInfo.age}
          onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
          min="1"
          max="130"
        />
      </div>
      <div style={styles.field}>
        <label style={getThemedStyle(styles.label, styles.darkLabel)}>Sex:</label>
        <select
          style={getThemedStyle(styles.input, styles.darkInput)}
          value={patientInfo.sex}
          onChange={(e) => setPatientInfo(prev => ({ ...prev, sex: e.target.value }))}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="male">Other</option>
        </select>
      </div>
      <button onClick={() => setStep(1)} style={styles.btnPrimary}>
        Continue to Symptoms
      </button>
    </div>
  );

  // Render symptom selection with improved UI
  const renderSymptomSelection = () => (
    <div>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Add Your Symptoms</div>
          <div style={getThemedStyle(styles.subtitle, styles.darkSubtitle)}>Search and add the symptoms you're experiencing.</div>
        </div>
      </div>

      <div style={styles.field}>
        <input
          style={getThemedStyle(styles.input, styles.darkInput)}
          value={symptomSearch}
          onChange={(e) => setSymptomSearch(e.target.value)}
          placeholder="Search symptoms (e.g., headache, fever, cough)"
        />
      </div>

      {searchResults.length > 0 && (
        <div style={getThemedStyle(styles.searchResultsContainer, styles.searchResultsContainerDark)}>
          {searchResults.map((symptom) => (
            <div key={symptom.id} style={getThemedStyle(styles.searchResultItem, styles.searchResultItemDark)}>
              <div>
                <div style={getThemedStyle(styles.searchResultName, styles.searchResultNameDark)}>{symptom.name}</div>
                {symptom.common_name && symptom.common_name !== symptom.name && (
                  <div style={getThemedStyle(styles.searchResultCommonName, styles.searchResultCommonNameDark)}>({symptom.common_name})</div>
                )}
              </div>
              <button
                onClick={() => addSymptom(symptom)}
                style={styles.btnPrimary}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {symptoms.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h4 style={getThemedStyle({ color: "var(--color-text-primary, #1a1a1a)" }, styles.darkText)}>Selected Symptoms:</h4>
          <div>
            {symptoms.map((symptom) => (
              <span key={symptom.id} style={styles.symptomChip}>
                {symptom.name}
                <button
                  onClick={() => removeSymptom(symptom.id)}
                  style={styles.removeBtn}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <div style={getThemedStyle(styles.errorBox, styles.errorBoxDark)}>{error}</div>}

      {symptoms.length === 0 && !symptomSearch && (
        <div style={getThemedStyle(styles.warningBox, styles.warningBoxDark)}>
          Start typing to search for symptoms, or select from common symptoms that will appear.
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={startDiagnosis}
          disabled={symptoms.length === 0 || isLoading}
          style={{
            ...styles.btnPrimary,
            opacity: (symptoms.length === 0 || isLoading) ? 0.5 : 1,
            cursor: (symptoms.length === 0 || isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? "Starting..." : "Start Diagnosis"}
        </button>
        <button onClick={() => setStep(0)} style={getThemedStyle(styles.btnGhost, styles.btnGhostDark)}>
          Back
        </button>
      </div>
    </div>
  );

  // Render question
  const renderQuestion = () => (
    <div>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Question {questionCount} of {maxQuestions}</div>
          <div style={getThemedStyle(styles.subtitle, styles.darkSubtitle)}>Answer to help improve the diagnosis accuracy.</div>
        </div>
      </div>

      {error && <div style={getThemedStyle(styles.errorBox, styles.errorBoxDark)}>{error}</div>}

      {currentQuestion && (
        <div style={getThemedStyle(styles.questionCard, styles.darkQuestionCard)}>
          <h3 style={{ marginBottom: 12, color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>{currentQuestion.text}</h3>

          {currentQuestion.type === "single" && currentQuestion.items && currentQuestion.items.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 12, fontWeight: 500, color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>
                {currentQuestion.items[0].name}
              </div>
              <button
                onClick={() => answerQuestion(currentQuestion.items[0].id, "present")}
                disabled={isLoading}
                style={{ ...styles.btnPrimary, marginRight: 8 }}
              >
                Yes
              </button>
              <button
                onClick={() => answerQuestion(currentQuestion.items[0].id, "absent")}
                disabled={isLoading}
                style={{ ...getThemedStyle(styles.btnGhost, styles.btnGhostDark), marginRight: 8 }}
              >
                No
              </button>
              <button
                onClick={() => answerQuestion(currentQuestion.items[0].id, "unknown")}
                disabled={isLoading}
                style={getThemedStyle(styles.btnGhost, styles.btnGhostDark)}
              >
                Don't know
              </button>
            </div>
          )}

          {currentQuestion.type === "group_single" && currentQuestion.items && (
            <div style={{ marginTop: 12 }}>
              {currentQuestion.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => answerQuestion(item.id, "present")}
                  disabled={isLoading}
                  style={{ ...getThemedStyle(styles.choiceButton, styles.choiceButtonDark), display: "block", marginBottom: 8, width: "100%" }}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => answerQuestion("skip", "unknown")}
                disabled={isLoading}
                style={{ ...getThemedStyle(styles.btnGhost, styles.btnGhostDark), marginTop: 8 }}
              >
                None of these apply
              </button>
            </div>
          )}

          {currentQuestion.type === "group_multiple" && currentQuestion.items && (
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8, fontSize: 14, color: isDarkTheme ? "#9ca3af" : "#666" }}>
                Select all that apply:
              </div>
              {currentQuestion.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => answerQuestion(item.id, "present")}
                  disabled={isLoading}
                  style={getThemedStyle(styles.choiceButton, styles.choiceButtonDark)}
                >
                  {item.name}
                </button>
              ))}
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => continueDialogue()}
                  disabled={isLoading}
                  style={styles.btnPrimary}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Add skip to results button */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: isDarkTheme ? "1px solid #374151" : "1px solid #eee" }}>
            <button
              onClick={() => {
                setCurrentQuestion(null);
                setStep(3);
              }}
              disabled={isLoading}
              style={{ ...getThemedStyle(styles.btnGhost, styles.btnGhostDark), fontSize: "0.9rem" }}
            >
              Skip remaining questions and see results
            </button>
          </div>
        </div>
      )}

      {conditions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4 style={getThemedStyle({ color: "var(--color-text-primary, #1a1a1a)" }, styles.darkText)}>Current Possible Conditions:</h4>
          {conditions.slice(0, 3).map((condition) => (
            <div key={condition.id} style={getThemedStyle(styles.conditionItem, styles.darkConditionItem)}>
              <strong style={{ color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>{condition.name}</strong>
              <span style={{ marginLeft: 8, color: isDarkTheme ? "#9ca3af" : "#666" }}>
                ({Math.round(condition.probability * 100)}% probability)
              </span>
            </div>
          ))}
          {conditions.length > 3 && (
            <div style={{ fontSize: "0.9rem", color: isDarkTheme ? "#9ca3af" : "#666", marginTop: 8 }}>
              ...and {conditions.length - 3} more conditions
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderResults = () => (
    <div>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            {patientInfo.name ? `${patientInfo.name}'s Assessment Results` : 'Assessment Results'}
          </div>
          <div style={getThemedStyle(styles.subtitle, styles.darkSubtitle)}>Based on the information provided</div>
        </div>
      </div>

      {error && <div style={getThemedStyle(styles.errorBox, styles.errorBoxDark)}>{error}</div>}

      {/* Personalized greeting */}
      {patientInfo.name && (
        <div style={getThemedStyle(styles.infoBox, styles.infoBoxDark)}>
          <h4 style={{ margin: 0, color: "var(--color-secondary, #0d9db8)" }}>
            Hello {patientInfo.name},
          </h4>
          <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>
            Based on your symptoms and responses, here's what our AI assessment found:
          </p>
        </div>
      )}

      {conditions.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={getThemedStyle({ color: "var(--color-text-primary, #1a1a1a)" }, styles.darkText)}>Possible Conditions:</h3>
          <div style={{ marginBottom: 12, fontSize: "0.9rem", color: isDarkTheme ? "#9ca3af" : "#666" }}>
            These are potential conditions based on your symptoms. A healthcare provider can provide proper diagnosis.
          </div>
          {conditions.map((condition, index) => (
            <div key={condition.id} style={{
              ...getThemedStyle(styles.conditionItem, styles.darkConditionItem),
              background: index === 0 ? "rgba(13,157,184,0.1)" : getThemedStyle(styles.conditionItem, styles.darkConditionItem).background
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>{condition.name}</strong>
                <span style={{ color: "#0d9db8", fontWeight: "bold" }}>
                  {Math.round(condition.probability * 100)}%
                </span>
              </div>
              {condition.common_name && condition.common_name !== condition.name && (
                <div style={{ fontSize: 12, color: isDarkTheme ? "#9ca3af" : "#666", marginTop: 4 }}>
                  Also known as: {condition.common_name}
                </div>
              )}
              {index === 0 && (
                <div style={{ fontSize: "0.85rem", color: "#0d9db8", marginTop: 6, fontStyle: "italic" }}>
                  Most likely condition based on your symptoms
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!finalResult?.triage && (
        <button onClick={getTriage} disabled={isLoading} style={styles.btnPrimary}>
          {isLoading ? "Getting recommendation..." : "Get Care Recommendation"}
        </button>
      )}

      {finalResult?.triage && (
        <div style={{ background: "rgba(13,157,184,0.1)", padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <h3 style={getThemedStyle({ color: "var(--color-text-primary, #1a1a1a)" }, styles.darkText)}>Recommended Care Level:</h3>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#0d9db8" }}>
            {getTriageDisplayText(finalResult.triage.triage_level)}
          </div>
          {finalResult.triage.description && (
            <p style={{ marginTop: 8, color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>{finalResult.triage.description}</p>
          )}
          {getTriageUrgency(finalResult.triage.triage_level) && (
            <div style={{
              marginTop: 12,
              padding: 12,
              background: getTriageColor(finalResult.triage.triage_level),
              borderRadius: 8,
              fontWeight: "bold",
              color: "#1a1a1a"
            }}>
              {getTriageUrgency(finalResult.triage.triage_level)}
            </div>
          )}
        </div>
      )}

      {/* Care recommendations */}
      {finalResult?.triage && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={getThemedStyle({ color: "var(--color-text-primary, #1a1a1a)" }, styles.darkText)}>What You Need to Do:</h3>
          <div style={getThemedStyle(styles.careRecommendations, styles.careRecommendationsDark)}>
            {getCareRecommendations(finalResult.triage.triage_level, conditions).map((recommendation, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: index < getCareRecommendations(finalResult.triage.triage_level, conditions).length - 1 ? 12 : 0
              }}>
                <span style={{
                  color: "#0d9db8",
                  fontWeight: "bold",
                  marginRight: 8,
                  marginTop: 2,
                  fontSize: "1.2rem"
                }}>
                  {index + 1}.
                </span>
                <span style={{ fontSize: "0.95rem", lineHeight: "1.5", color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>
                  {recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Take care message */}
      <div style={getThemedStyle(styles.takeCareMessage, styles.takeCareMessageDark)}>
        <h4 style={{ color: "var(--color-secondary, #0d9db8)", margin: "0 0 12px 0" }}>
          Take Care Message:
        </h4>
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.6", color: isDarkTheme ? "#e5e7eb" : "#1a1a1a" }}>
          {patientInfo.name ? `${patientInfo.name}, ` : ''}
          remember that this assessment is a helpful tool, but it cannot replace professional medical judgment.
          Your health is important - please follow the care recommendations above and don't hesitate to seek
          medical attention if you're concerned about your symptoms. Take care of yourself and stay healthy!
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={reset} style={getThemedStyle(styles.btnGhost, styles.btnGhostDark)}>
          Start New Assessment
        </button>

        {/* Save Assessment Button */}
        {isAuthenticated && !assessmentSaved && (
          <button
            onClick={handleSaveAssessment}
            disabled={isSavingAssessment}
            style={{
              ...styles.btnPrimary,
              opacity: isSavingAssessment ? 0.6 : 1,
              cursor: isSavingAssessment ? 'not-allowed' : 'pointer'
            }}
          >
            {isSavingAssessment ? 'Saving...' : 'Save Assessment'}
          </button>
        )}

        {assessmentSaved && (
          <div style={{
            padding: "10px 20px",
            background: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            borderRadius: 12,
            fontSize: "14px",
            fontWeight: 600,
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            ✓ Assessment Saved
          </div>
        )}

        <a
          href="/contact"
          style={styles.feedbackButton}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--color-secondary)";
            e.target.style.color = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(13, 157, 184, 0.1)";
            e.target.style.color = "var(--color-secondary)";
          }}
        >
          Share Feedback
        </a>
      </div>

      <div style={getThemedStyle(styles.disclaimerBox, styles.disclaimerBoxDark)}>
        <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment. If you're experiencing a medical emergency, call emergency services immediately.
      </div>
    </div>
  );

  // Custom Loader Component
  const LoaderComponent = () => (
    <div style={styles.loaderContainer}>
      <div style={styles.loader}>
        <div style={styles.loaderAfter}></div>
      </div>
      <div style={{ color: "var(--color-secondary)", fontSize: "1.1rem", fontWeight: 500 }}>
        Loading DoctorX Symptom Analyzer...
      </div>
    </div>
  );

  // Toast Notification Component
  const ToastNotification = () => (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: toastVisible ? '20px' : '-400px',
      background: toastType === 'success'
        ? 'linear-gradient(135deg, #10b981, #059669)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      zIndex: 10000,
      transition: 'right 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      minWidth: '300px',
      maxWidth: '400px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ fontSize: '24px' }}>
        {toastType === 'success' ? '✓' : '✕'}
      </div>
      <div style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>
        {toastMessage}
      </div>
      <button
        onClick={() => setToastVisible(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
      >
        ×
      </button>
    </div>
  );

  // Main render with loading screen
  if (isPageLoading) {
    return (
      <>
        <style>
          {`
            :root {
              --color-primary: #ffffff;
              --color-secondary: #0d9db8;
              --color-third: #00aeffff;
              --color-fourth: #f0f9ff;
              --color-dark: #1a1a1a;
              --color-light: #e5e7eb;
              --color-text-primary: #1a1a1a;
              --color-text-secondary: #666666;
            }
            
            [data-theme="dark"] {
              --color-primary: #0f172a;
              --color-secondary: #0d9db8;
              --color-third: #60a5fa;
              --color-fourth: #1f2937;
              --color-dark: #1a1a1a;
              --color-light: #e5e7eb;
              --color-text-primary: #e5e7eb;
              --color-text-secondary: #9ca3af;
            }
            
            @keyframes rotation {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes slideInFromTop {
              from {
                opacity: 0;
                transform: translateY(-50px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .loader {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              display: inline-block;
              border-top: 4px solid var(--color-secondary);
              border-right: 4px solid transparent;
              box-sizing: border-box;
              animation: rotation 1s linear infinite;
              position: relative;
            }
            
            .loader::after {
              content: '';
              box-sizing: border-box;
              position: absolute;
              left: 0;
              top: 0;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              border-left: 4px solid var(--color-third);
              border-bottom: 4px solid transparent;
              animation: rotation 0.5s linear infinite reverse;
            }
          `}
        </style>
        <div style={{
          ...styles.root,
          ...(isDarkTheme ? styles.rootDark : {}),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "none"
        }}>
          <LoaderComponent />
        </div>
      </>
    );
  }

  // Main render
  return (
    <>
      <style>
        {`
          :root {
            --color-primary: #ffffff;
            --color-secondary: #0d9db8;
            --color-third: #00aeffff;
            --color-fourth: #f0f9ff;
            --color-dark: #1a1a1a;
            --color-light: #e5e7eb;
            --color-text-primary: #1a1a1a;
            --color-text-secondary: #666666;
          }
          
          [data-theme="dark"] {
            --color-primary: #0f172a;
            --color-secondary: #0d9db8;
            --color-third: #60a5fa;
            --color-fourth: #1f2937;
            --color-dark: #1a1a1a;
            --color-light: #e5e7eb;
            --color-text-primary: #e5e7eb;
            --color-text-secondary: #9ca3af;
          }
          
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .loader {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-block;
            border-top: 4px solid var(--color-secondary);
            border-right: 4px solid transparent;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            position: relative;
          }
          
          .loader::after {
            content: '';
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border-left: 4px solid var(--color-third);
            border-bottom: 4px solid transparent;
            animation: rotation 0.5s linear infinite reverse;
          }
        `}
      </style>

      {/* Toast Notification */}
      <ToastNotification />

      <div style={getThemedStyle(styles.root, styles.rootDark)}>
        {/* Main Title */}
        <div style={styles.mainTitle}>DoctorX</div>

        <div style={getThemedStyle(styles.card, styles.darkCard)}>
          <div style={styles.left}>
            {step === 0 && renderPatientForm()}
            {step === 1 && renderSymptomSelection()}
            {step === 2 && renderQuestion()}
            {step === 3 && renderResults()}
          </div>
        </div>
      </div>
    </>
  );
}