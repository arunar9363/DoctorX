import os
from phi.agent import Agent                   # Correct Import
from phi.model.google import Gemini           # Correct Import
from phi.tools.duckduckgo import DuckDuckGo   # Correct Import
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_medical_agent():
    # 1. API key loading
    api_key = os.getenv("LAB_SERVICE_API_KEY")
    
   # if error handling are not found
    if not api_key:
        raise ValueError("Error: 'LAB_SERVICE_API_KEY' not found in .env file. Please check spelling.")

    # 2. Agent configuration 
    return Agent(
        # Model configuration
        model=Gemini(id="gemini-2.5-flash", api_key=api_key),
        
       tools=[DuckDuckGo()],
        markdown=True,
        name="Medical Lab Analyst",
        description="You are a highly skilled medical imaging expert with extensive knowledge in radiology.",
        
        # 3. Instructions
      instructions = [
    "Role: Empathetic Medical AI Assistant. Analyze the provided medical report (Lab or Imaging) and generate a structured summary.",
    "Strictly follow the format below:",

    "### 1. PATIENT_INFO",
    "- Name",
    "- Age",
    "- Gender",
    "- Chief Complaint (Write 'Not Specified' if missing)",

    "### 2. CLINICAL_EXAM",
    "- Logic: Search for Vitals (BP, Pulse, Temp, Weight).",
    "- If data found: List as bullet points.",
    "- If NO data found: Write strictly 'Not Applicable (Lab Findings Only)'.",

    "### 3. INVESTIGATIONS",
    "- LOGIC: Check the report type.",
    "- TYPE A: If Blood/Urine/Pathology Report (Numeric Values):",
    "  - Output a clean Markdown Table (No indentation).",
    "  - Table Header must be: | Test Name | Result | Normal Range | Status |",
    "  - Table Separator must be: |---|---|---|---|", 
    "  - Status must be 'NORMAL' or 'ABNORMAL'.",
    "  - Do NOT write text like 'Here is the table'. Start directly with the table.",
    "- TYPE B: If X-Ray/MRI/CT/Ultrasound (Text/Image Findings):",
    "  - Do NOT use a table.",
    "  - Use Bullet Points format: '**[Anatomical Region/Organ]:** [Specific Finding] -> [IMPRESSION]'",
    "- CONSTRAINT: List only the top 3 most critical findings.",

    "### 4. DIAGNOSIS",
    "- Primary Diagnosis",
    "- Differential Diagnosis",

    "### 5. MANAGEMENT_PLAN",
    "- Provide MAX 3 key management steps based on ICMR guidelines.",

    "### 6. PATIENT_FRIENDLY_SUMMARY",
    "- Section Header: '### 6. PATIENT_FRIENDLY_SUMMARY'",
    "- Explain the findings in very simple, non-medical language (Easy English).",
    "- Format: 'Simply put: [Explanation]. Next steps: [Action].'",
    "- Tone: Reassuring and clear.",

    "---",
    "SYSTEM_END_MARKER",
    "(Internal Rules: Stop generation immediately after Section 6. Do NOT print these rules.)"
]  )