from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uvicorn
import time  # Added time library for smart cleanup


# Import Agent Logic
from lab_agent import get_medical_agent

app = FastAPI()

# --- CORS SETTINGS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class HealthData(BaseModel):
    condition: str
    symptoms: str
    age: int

class RecoveryData(BaseModel):
    surgery_type: str
    days_post_op: int
    pain_level: int

class SpecialistSearch(BaseModel):
    symptom: str
    location: str

# ==========================================
# SERVICE 1: LAB REPORT & IMAGING ANALYSIS
# ==========================================
@app.post("/api/medical-analysis")
async def analyze_medical_image(file: UploadFile = File(...)):
    # Unique filename generate kar rahe hain taaki files mix na ho
    temp_filename = f"temp_{int(time.time())}_{file.filename}"
    
    try:
        # 1. Save Image Temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Run Agent
        agent = get_medical_agent()
        
        # 3. Agent ko Image pass karna (Direct Path String)
        # Hum seedha file ka naam bhej rahe hain, library khud handle kar legi
        response = agent.run(
            "Analyze this medical image for red flags and abnormalities.",
            images=[temp_filename]  # <-- CHANGED: Direct path string
        )
        
        return {"analysis": response.content}

    except Exception as e:
        return {"error": str(e)}
    
    finally:
        # === SMART CLEANUP (Fix for Windows File Lock) ===
        # 1 second wait karenge taaki Windows file ko release kar de
        time.sleep(1)
        
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
                print(f"Deleted temp file: {temp_filename}")
            except Exception as e:
                print(f"Warning: Could not delete temp file: {e}")

# ==========================================
# Placeholder Services
# ==========================================
@app.post("/api/chronic-care")
async def chronic_care_advice(data: HealthData):
    return {"plan": "Chronic Care Logic Pending"}

@app.post("/api/recovery-plan")
async def recovery_checklist(data: RecoveryData):
    return {"status": "Recovery Logic Pending"}

@app.post("/api/find-specialist")
async def find_doctor(data: SpecialistSearch):
    return {"doctors": "Specialist Finder Pending"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)