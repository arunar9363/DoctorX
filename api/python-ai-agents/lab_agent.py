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

    # 2. Agent banayo with tools and instructions
    return Agent(
        # Model configuration
        model=Gemini(id="gemini-2.5-flash", api_key=api_key),
        
       tools=[DuckDuckGo()],
        markdown=True,
        name="Medical Lab Analyst",
        description="You are a highly skilled medical imaging expert with extensive knowledge in radiology.",
        
        # 3. Instructions (Dimaag)
        instructions=[
           "Analyze the patient's medical image and structure your response strictly as follows:",
            "### 1. Image Type & Region",
            "- Specify imaging modality (X-ray/MRI/CT/Ultrasound/etc.)",
            "- Identify the patient's anatomical region and positioning",
            "- Comment on image quality",
            "### 2. Key Findings",
            "- List primary observations systematically",
            "- Note any abnormalities with precise descriptions",
            "- Rate severity: Normal/Mild/Moderate/Severe",
            "### 3. Diagnostic Assessment",
            "- Provide primary diagnosis with confidence level",
            "- List differential diagnoses",
            "### 4. Patient-Friendly Explanation",
            "- Explain in simple language",
            "- write final summary in bullet points what was found and what they have prolebly have",
            "### 5. Research Context",
            "- Use DuckDuckGo to find recent medical literature",
            "- Include 2-3 key references",
            "DISCLAIMER: This is AI-generated. Consult a professional doctor."
        ]
    )