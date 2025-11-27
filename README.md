# DoctorXCare - AI-Powered Digital Health Platform

![DoctorXCare Logo](public/assets/MAINLOGO1.png)

> **Smart Healthcare at Your Fingertips.**

DoctorXCare is a comprehensive full-stack digital health application designed to democratize access to medical information. It combines advanced AI (Google Gemini), medical logic engines (Infermedica), and real-time global health data (WHO) to provide users with accurate symptom analysis, disease information, and triage recommendations.

**⚠️ Disclaimer:** This project is for educational and informational purposes only. It is not a licensed medical device and does not replace professional medical advice, diagnosis, or treatment.

---

## 🚀 Key Features

### 🩺 Advanced Symptom Checker & Triage
- **AI-Driven Assessment:** Uses the **Infermedica API** to conduct a dynamic, interview-style assessment of user symptoms.
- **Triage Logic:** Categorizes results into levels such as "Self-Care," "Consult Doctor," or "Emergency" based on medical protocols.
- **Risk Factors:** Accounts for age, gender, and risk factors (via `api/risk_factors.js`).

### 🤖 DoctorX AI Assistant
- **Conversational Medical Bot:** Powered by **Google Gemini (Generative AI)** to answer general health queries in natural language.
- **Contextual Awareness:** Configured with a system prompt to act as a helpful, empathetic medical professional while strictly adhering to safety guidelines.

### 📚 Disease & Outbreak Intelligence
- **Disease Database:** Searchable library of diseases with symptoms, prevention, and treatment details.
- **Real-time WHO Updates:** Custom hooks (`useWHOApi.js`) fetch the latest disease outbreaks and news directly from the World Health Organization RSS feeds.

### 👤 User Management & History
- **Authentication:** Secure Login/Registration via **Firebase Auth** (Email/Password & Google Sign-In).
- **Health History:** Saves previous symptom assessments and bookmarked diseases to **Firestore**, allowing users to track their health journey.
- **Profile Management:** Users can manage personal details (DOB, Blood Group, Existing Conditions) which are used to personalize assessments.

### 🆘 Emergency Support
- **SOS Features:** Quick access to national emergency helplines (Ambulance, Police, Mental Health support) via a dedicated modal.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Routing:** React Router v6 (Protected Routes implemented)
- **Styling:** CSS Modules, Bootstrap 5, Responsive Design (Dark/Light Mode support)
- **Icons:** Lucide React

### Backend (Serverless)
- **Architecture:** Node.js Serverless Functions (Vercel API Routes)
- **Role:** Acts as a secure proxy layer to hide API keys and handle CORS.
- **Endpoints:**
  - `/api/diagnosis` - Handles Infermedica diagnosis logic.
  - `/api/chat` - Handles Google Gemini interactions.
  - `/api/triage` - Generates final care recommendations.
  - `/api/who` - Proxies WHO RSS feeds.

### Infrastructure & Services
- **Database:** Firebase Firestore (NoSQL)
- **Auth:** Firebase Authentication
- **Medical Logic:** Infermedica API
- **LLM:** Google Gemini API
- **Deployment:** Vercel (Recommended)

---

## 📂 Project Structure

```bash
DoctorXCare/
├── api/                    # Serverless Backend Functions
│   ├── chat.js             # Google Gemini Proxy
│   ├── diagnosis.js        # Infermedica Diagnosis Proxy
│   ├── symptoms.js         # Symptom Search Proxy
│   └── ...
├── public/                 # Static Assets (Images, Logos)
├── src/
│   ├── components/
│   │   ├── common/         # Navbar, Footer, LoginModal, Toast
│   │   ├── features/       # Core Logic (SymptomChecker, DiseaseSearch)
│   │   └── sections/       # UI Sections (Hero, About, Audience)
│   ├── hooks/              # Custom Hooks (useWHOApi)
│   ├── pages/              # Route Pages (Home, Profile, History)
│   ├── services/           # Firebase Service functions
│   ├── App.jsx             # Main Application Component
│   ├── firebase.js         # Firebase Configuration
│   └── main.jsx            # Entry Point
├── .env.example            # Environment Variable Template
└── package.json            # Dependencies