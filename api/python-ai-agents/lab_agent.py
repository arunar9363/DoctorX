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
    "Role: Medical AI Assistant. Analyze the provided lab report/medical text and generate a structured summary.",
    "Strictly follow the format below:",

    "### 1. PATIENT_INFO",
    "- Name",
    "- Age",
    "- Gender",
    "- Chief Complaint (If mentioned, otherwise write 'Not Specified')",

    "### 2. CLINICAL_EXAM",
    "- Extract Vitals (BP, Pulse, Temp, Weight) ONLY if explicitly mentioned in the text.",
    "- If no clinical examination data is present, strictly write: 'Not Recorded in Report'.",
    "- Do NOT output 'N/A' for individual missing fields.",

    "### 3. INVESTIGATIONS",
    "- Format as a Markdown Table: | Test Name | Result | Normal Range | Status |",
    "- Status column must be: 'NORMAL' or 'ABNORMAL' (High/Low).",
    "- CONSTRAINT: Filter and list ONLY the Top 3 most critical/abnormal findings.",

    "### 4. DIAGNOSIS",
    "- Primary Diagnosis (Based on abnormal findings)",
    "- Differential Diagnosis (Possible alternative causes)",

    "### 5. MANAGEMENT_PLAN",
    "- CONSTRAINT: Provide MAXIMUM 3 key management steps.",
    "- Ensure recommendations align with standard medical guidelines (e.g., ICMR).",

    "---",
    "CRITICAL RULES:",
    "1. NO HALLUCINATIONS: If data is missing, write 'Not Recorded'. Do not invent numbers.",
    "2. CONSTRAINT: Max 3 Investigations (focus on abnormalities), Max 3 Management points.",
    "3. TONE: Formal, professional, and precise medical terminology.",
    "4. SAFETY: Follow ICMR guidelines where applicable.",
    "DISCLAIMER: This is AI-generated for informational purposes. Consult a professional doctor."
]    )