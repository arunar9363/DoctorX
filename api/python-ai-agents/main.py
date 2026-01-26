from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
import uvicorn
import time
import sys
import json
from datetime import datetime, timedelta

# === VERCEL IMPORT FIX ===
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import Agent Logic
from lab_agent import get_medical_agent
from tracking_agent import get_health_tracking_agent, get_trend_visualization_agent, get_report_extraction_agent

app = FastAPI()

# --- CORS SETTINGS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# DATA MODELS
# ==========================================

# --- Existing Models ---
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

# --- New Models for Health Tracking ---

class VitalReading(BaseModel):
    """Single vital sign reading"""
    date: str  # ISO format: "2025-01-20T10:30:00"
    value: float
    unit: str
    context: Optional[str] = None  # e.g., "Fasting", "Post-meal", "At rest"
    notes: Optional[str] = None

class BloodPressureReading(BaseModel):
    """Blood pressure specific reading"""
    date: str
    systolic: float
    diastolic: float
    pulse: Optional[int] = None
    context: Optional[str] = None  # e.g., "Morning", "Evening", "After exercise"
    notes: Optional[str] = None

class HealthTrackingData(BaseModel):
    """Complete health tracking submission"""
    patient_id: str
    condition: str  # "Diabetes", "Hypertension", "Thyroid", "General"
    
    # Optional vital signs arrays
    blood_pressure: Optional[List[BloodPressureReading]] = []
    blood_glucose: Optional[List[VitalReading]] = []
    heart_rate: Optional[List[VitalReading]] = []
    weight: Optional[List[VitalReading]] = []
    oxygen_saturation: Optional[List[VitalReading]] = []
    
    # Thyroid specific
    tsh: Optional[List[VitalReading]] = []
    t3: Optional[List[VitalReading]] = []
    t4: Optional[List[VitalReading]] = []
    
    # Medication adherence
    medications: Optional[List[dict]] = []
    
    # Additional context
    symptoms: Optional[str] = None
    lifestyle_changes: Optional[str] = None

class TrendAnalysisRequest(BaseModel):
    """Request for trend visualization insights"""
    patient_id: str
    metric_type: str  # "blood_pressure", "blood_glucose", "weight", etc.
    time_range: int = 30  # days
    readings: List[dict]  # Array of {date, value} objects

# ==========================================
# SERVICE 1: LAB REPORT & IMAGING ANALYSIS
# ==========================================
@app.post("/api/medical-analysis")
async def analyze_medical_image(file: UploadFile = File(...)):
    try:
        save_dir = "/tmp" if os.path.exists("/tmp") else "."
        temp_filename = os.path.join(save_dir, f"temp_{int(time.time())}_{file.filename}")
        
        # Save Image Temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run Agent
        agent = get_medical_agent()
        response = agent.run(
            "Analyze this medical image for red flags and abnormalities.",
            images=[temp_filename]
        )
        
        return {"analysis": response.content}

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return {"error": str(e)}
    
    finally:
        time.sleep(1)
        try:
            if 'temp_filename' in locals() and os.path.exists(temp_filename):
                os.remove(temp_filename)
                print(f"Deleted temp file: {temp_filename}")
        except Exception as e:
            print(f"Warning: Could not delete temp file: {e}")

# ==========================================
# SERVICE 2: CHRONIC CARE & HEALTH TRACKING
# ==========================================

@app.post("/api/health-tracking/scan-report")
async def scan_health_report(
    file: UploadFile = File(...),
    patient_id: str = "demo_patient",
    condition: str = "General"
):
    """
    NEW ENDPOINT: Scan and extract data from medical reports (Lab reports, BP logs, etc.)
    Supports: PNG, JPG, JPEG, PDF
    Returns: Structured vital signs data extracted from the report
    """
    try:
        # Validate file type
        allowed_extensions = ['.png', '.jpg', '.jpeg', '.pdf']
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Please upload PNG, JPG, or PDF files."
            )
        
        # Save file temporarily
        save_dir = "/tmp" if os.path.exists("/tmp") else "."
        temp_filename = os.path.join(save_dir, f"health_report_{int(time.time())}_{file.filename}")
        
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Use Report Extraction Agent
        agent = get_report_extraction_agent()
        response = agent.run(
            f"""Extract vital signs data from this health report.
            
Patient Condition: {condition}

Please extract and structure the following data in JSON format:
- Blood Pressure readings (with dates, systolic, diastolic, pulse if available)
- Blood Glucose readings (with dates, values, context like fasting/post-meal)
- Heart Rate readings
- Weight measurements
- Any other vital signs present

Return ONLY a valid JSON object with this structure:
{{
  "blood_pressure": [
    {{"date": "2025-01-20T10:30:00", "systolic": 120, "diastolic": 80, "pulse": 72, "context": "Morning"}}
  ],
  "blood_glucose": [
    {{"date": "2025-01-20T10:30:00", "value": 95, "unit": "mg/dL", "context": "Fasting"}}
  ],
  "heart_rate": [
    {{"date": "2025-01-20T10:30:00", "value": 72, "unit": "bpm", "context": "Resting"}}
  ],
  "weight": [
    {{"date": "2025-01-20T10:30:00", "value": 70, "unit": "kg"}}
  ],
  "report_date": "2025-01-20",
  "patient_name": "Name if visible",
  "summary": "Brief summary of findings"
}}

If no data is found for a category, use an empty array [].""",
            images=[temp_filename]
        )
        
        # Parse AI response to extract JSON
        content = response.content
        
        # Try to extract JSON from the response
        import re
        json_match = re.search(r'\{[\s\S]*\}', content)
        
        if json_match:
            extracted_data = json.loads(json_match.group())
        else:
            # If no JSON found, return raw content for debugging
            extracted_data = {
                "raw_response": content,
                "blood_pressure": [],
                "blood_glucose": [],
                "heart_rate": [],
                "weight": [],
                "error": "Could not parse structured data from report"
            }
        
        # Clean up temp file
        try:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
        except Exception as e:
            print(f"Warning: Could not delete temp file: {e}")
        
        return {
            "success": True,
            "patient_id": patient_id,
            "condition": condition,
            "filename": file.filename,
            "extracted_data": extracted_data,
            "scanned_at": datetime.now().isoformat()
        }
        
    except json.JSONDecodeError as e:
        print(f"JSON Parsing Error: {str(e)}")
        return {
            "success": False,
            "error": "Failed to parse extracted data",
            "raw_response": content if 'content' in locals() else "No response"
        }
    except Exception as e:
        print(f"Report Scanning Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Report scanning failed: {str(e)}")

@app.post("/api/health-tracking/analyze")
async def analyze_health_tracking(data: HealthTrackingData):
    """
    Comprehensive health tracking analysis for chronic conditions
    Analyzes vitals, detects trends, and provides personalized recommendations
    """
    try:
        # Build comprehensive data summary for AI agent
        tracking_summary = f"""
## PATIENT HEALTH TRACKING DATA

**Patient ID:** {data.patient_id}
**Primary Condition:** {data.condition}
**Analysis Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

"""
        
        # Add Blood Pressure Data
        if data.blood_pressure and len(data.blood_pressure) > 0:
            tracking_summary += "\n### BLOOD PRESSURE READINGS:\n"
            for reading in data.blood_pressure:
                tracking_summary += f"- Date: {reading.date} | Systolic: {reading.systolic} mmHg | Diastolic: {reading.diastolic} mmHg"
                if reading.pulse:
                    tracking_summary += f" | Pulse: {reading.pulse} bpm"
                if reading.context:
                    tracking_summary += f" | Context: {reading.context}"
                if reading.notes:
                    tracking_summary += f" | Notes: {reading.notes}"
                tracking_summary += "\n"
        
        # Add Blood Glucose Data
        if data.blood_glucose and len(data.blood_glucose) > 0:
            tracking_summary += "\n### BLOOD GLUCOSE READINGS:\n"
            for reading in data.blood_glucose:
                tracking_summary += f"- Date: {reading.date} | Value: {reading.value} {reading.unit}"
                if reading.context:
                    tracking_summary += f" | Context: {reading.context}"
                if reading.notes:
                    tracking_summary += f" | Notes: {reading.notes}"
                tracking_summary += "\n"
        
        # Add Heart Rate Data
        if data.heart_rate and len(data.heart_rate) > 0:
            tracking_summary += "\n### HEART RATE READINGS:\n"
            for reading in data.heart_rate:
                tracking_summary += f"- Date: {reading.date} | Value: {reading.value} {reading.unit}"
                if reading.context:
                    tracking_summary += f" | Context: {reading.context}"
                tracking_summary += "\n"
        
        # Add Weight Data
        if data.weight and len(data.weight) > 0:
            tracking_summary += "\n### WEIGHT READINGS:\n"
            for reading in data.weight:
                tracking_summary += f"- Date: {reading.date} | Value: {reading.value} {reading.unit}\n"
        
        # Add Oxygen Saturation
        if data.oxygen_saturation and len(data.oxygen_saturation) > 0:
            tracking_summary += "\n### OXYGEN SATURATION (SpO₂) READINGS:\n"
            for reading in data.oxygen_saturation:
                tracking_summary += f"- Date: {reading.date} | Value: {reading.value}%"
                if reading.notes:
                    tracking_summary += f" | Notes: {reading.notes}"
                tracking_summary += "\n"
        
        # Add Thyroid Data if applicable
        if data.condition.lower() == "thyroid":
            if data.tsh and len(data.tsh) > 0:
                tracking_summary += "\n### TSH LEVELS:\n"
                for reading in data.tsh:
                    tracking_summary += f"- Date: {reading.date} | Value: {reading.value} {reading.unit}\n"
            
            if data.t3 and len(data.t3) > 0:
                tracking_summary += "\n### T3 LEVELS:\n"
                for reading in data.t3:
                    tracking_summary += f"- Date: {reading.date} | Value: {reading.value} {reading.unit}\n"
            
            if data.t4 and len(data.t4) > 0:
                tracking_summary += "\n### FREE T4 LEVELS:\n"
                for reading in data.t4:
                    tracking_summary += f"- Date: {reading.date} | Value: {reading.value} {reading.unit}\n"
        
        # Add Symptoms if provided
        if data.symptoms:
            tracking_summary += f"\n### REPORTED SYMPTOMS:\n{data.symptoms}\n"
        
        # Add Lifestyle Changes
        if data.lifestyle_changes:
            tracking_summary += f"\n### LIFESTYLE MODIFICATIONS:\n{data.lifestyle_changes}\n"
        
        # Add Medications
        if data.medications and len(data.medications) > 0:
            tracking_summary += "\n### CURRENT MEDICATIONS:\n"
            for med in data.medications:
                tracking_summary += f"- {med.get('name', 'Unknown')} - {med.get('dosage', 'N/A')} - {med.get('frequency', 'N/A')}\n"
        
        # Get AI Agent and Analyze
        agent = get_health_tracking_agent()
        response = agent.run(tracking_summary)
        
        return {
            "success": True,
            "patient_id": data.patient_id,
            "condition": data.condition,
            "analysis": response.content,
            "analyzed_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Health Tracking Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/health-tracking/trend-analysis")
async def trend_analysis(data: TrendAnalysisRequest):
    """
    Generate trend insights and visualization recommendations
    """
    try:
        # Build trend data summary
        trend_summary = f"""
## TREND ANALYSIS REQUEST

**Patient ID:** {data.patient_id}
**Metric Type:** {data.metric_type}
**Time Range:** Last {data.time_range} days
**Total Readings:** {len(data.readings)}

### DATA POINTS:
"""
        # Add all readings
        for reading in data.readings:
            trend_summary += f"- Date: {reading.get('date')} | Value: {reading.get('value')} {reading.get('unit', '')}\n"
        
        # Calculate basic statistics
        values = [r.get('value', 0) for r in data.readings if r.get('value') is not None]
        if values:
            avg_value = sum(values) / len(values)
            min_value = min(values)
            max_value = max(values)
            
            trend_summary += f"""
### STATISTICAL SUMMARY:
- Average: {avg_value:.2f}
- Minimum: {min_value:.2f}
- Maximum: {max_value:.2f}
- Range: {max_value - min_value:.2f}
"""
        
        # Get Trend Visualization Agent
        agent = get_trend_visualization_agent()
        response = agent.run(trend_summary)
        
        return {
            "success": True,
            "patient_id": data.patient_id,
            "metric_type": data.metric_type,
            "time_range": data.time_range,
            "insights": response.content,
            "statistics": {
                "average": round(avg_value, 2) if values else 0,
                "min": round(min_value, 2) if values else 0,
                "max": round(max_value, 2) if values else 0,
                "total_readings": len(values)
            }
        }
        
    except Exception as e:
        print(f"Trend Analysis Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

@app.post("/api/health-tracking/quick-log")
async def quick_vital_log(
    patient_id: str,
    metric_type: str,
    value: float,
    unit: str,
    context: Optional[str] = None
):
    """
    Quick endpoint for logging a single vital sign reading
    Useful for mobile apps and quick entries
    """
    try:
        log_entry = {
            "patient_id": patient_id,
            "metric_type": metric_type,
            "value": value,
            "unit": unit,
            "context": context,
            "timestamp": datetime.now().isoformat()
        }
        
        # In production, this would save to database
        # For now, return success with the logged data
        
        return {
            "success": True,
            "message": f"{metric_type.replace('_', ' ').title()} logged successfully",
            "data": log_entry
        }
        
    except Exception as e:
        print(f"Quick Log Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Logging failed: {str(e)}")

# ==========================================
# Placeholder Services (Existing)
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

# ==========================================
# HEALTH CHECK ENDPOINT
# ==========================================
@app.get("/")
async def health_check():
    return {
        "status": "online",
        "service": "DoctorX Care API",
        "version": "2.1",
        "endpoints": {
            "lab_analysis": "/api/medical-analysis",
            "scan_health_report": "/api/health-tracking/scan-report",
            "health_tracking": "/api/health-tracking/analyze",
            "trend_analysis": "/api/health-tracking/trend-analysis",
            "quick_log": "/api/health-tracking/quick-log"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)