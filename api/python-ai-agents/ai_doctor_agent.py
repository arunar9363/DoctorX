"""
AI Doctor Agent — Groq-powered conversational diagnostic assistant.
Conducts a structured audio-style consultation: 5-7 targeted questions,
then delivers a diagnosis, emergency level, and next-step recommendations.
"""

import os
import json
import re
from typing import Optional
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── Groq setup ───────────────────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
groq_client = Groq(api_key=GROQ_API_KEY)

# ── Model to use ─────────────────────────────────────────────────────────────
GROQ_MODEL = "llama-3.3-70b-versatile"

# ── Conversation state ────────────────────────────────────────────────────────
EMERGENCY_LEVELS = {
    1: {"label": "Non-Urgent",    "color": "#22c55e", "icon": "🟢", "action": "Schedule a routine appointment within a week."},
    2: {"label": "Low",           "color": "#84cc16", "icon": "🟡", "action": "See a doctor within 2–3 days."},
    3: {"label": "Moderate",      "color": "#f59e0b", "icon": "🟠", "action": "Visit a clinic today or tomorrow."},
    4: {"label": "High",          "color": "#ef4444", "icon": "🔴", "action": "Go to urgent care within hours."},
    5: {"label": "Critical",      "color": "#dc2626", "icon": "🚨", "action": "Call emergency services (112/911) immediately!"},
}

SYSTEM_PROMPT = """You are Doctorxcare Assistance, a highly experienced and empathetic AI physician with 20 years of clinical practice. You conduct professional medical consultations in a warm, reassuring, yet clinically precise manner.

LANGUAGE INSTRUCTION:
- At the very start of every new consultation, before asking about symptoms, ask the patient which language they prefer: English or Hindi (हिंदी).
- Once the patient selects a language, conduct the ENTIRE consultation in that language — all questions, responses, empathy notes, and the final assessment.
- If the patient chooses Hindi, write all responses in Hindi (Devanagari script). All JSON field values (question, empathy_note, summary, emergency_reason, immediate_actions, lifestyle_advice, red_flags, specialist_referral) must also be in Hindi.
- If the patient chooses English, conduct the consultation fully in English as normal.
- If the patient replies in a language without explicitly choosing, match that language automatically.

CONSULTATION PROTOCOL:
1. Ask the patient their preferred language (English or Hindi / हिंदी).
2. After language is chosen, greet the patient professionally and ask their primary complaint.
3. Ask 5–7 targeted follow-up questions ONE AT A TIME — never ask multiple questions together.
   - Cover: duration, severity (1-10 scale), associated symptoms, medical history, medications, allergies, recent exposures/triggers.
4. After gathering enough information, deliver a structured assessment.

ASSESSMENT FORMAT (output as JSON when you have enough info):
{
  "assessment_ready": true,
  "possible_conditions": ["Primary diagnosis", "Differential 1", "Differential 2"],
  "emergency_level": <1-5>,
  "emergency_reason": "Brief clinical reasoning for this level",
  "immediate_actions": ["Action 1", "Action 2"],
  "lifestyle_advice": ["Tip 1", "Tip 2"],
  "specialist_referral": "Type of specialist if needed, or 'None'",
  "red_flags": ["Warning signs to watch for"],
  "summary": "2-3 sentence clinical summary for the patient"
}

DURING QUESTIONING (not assessment):
{
  "assessment_ready": false,
  "question": "Your next clinical question here",
  "empathy_note": "Optional brief empathetic remark (max 10 words)"
}

RULES:
- Always be professional, calm, and compassionate.
- Never dismiss symptoms. Take every complaint seriously.
- Remind patient you are an AI and they should confirm with a real doctor.
- For ANY critical symptoms (chest pain + arm pain, stroke signs, severe allergic reaction), immediately flag emergency level 5.
- Keep questions short and clear — patients may be anxious.
- Base reasoning on established clinical guidelines (WHO, CDC, NICE).
- Always respond with valid JSON only. No extra text outside the JSON block.
"""


def _call_groq(messages: list) -> str:
    """
    Send a list of messages to Groq and return the assistant's reply text.

    Args:
        messages: Full conversation history in OpenAI-compatible format
                  [{"role": "system"|"user"|"assistant", "content": "..."}]

    Returns:
        Raw text string from the model.
    """
    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=0.4,
        max_tokens=1024,
    )
    return completion.choices[0].message.content.strip()


def start_consultation() -> dict:
    """
    Initialize a new consultation session.
    Returns the doctor's opening greeting asking for language preference.
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                "Start the consultation. First ask the patient whether they prefer "
                "to speak in English or Hindi (हिंदी). "
                "Respond in the JSON format with assessment_ready: false."
            ),
        },
    ]

    raw = _call_groq(messages)
    parsed = _safe_parse(raw)

    # Store the opening exchange in history
    history = [
        {"role": "user", "content": messages[1]["content"]},
        {"role": "assistant", "content": raw},
    ]

    return {
        "session_id": _new_session_id(),
        "turn": 0,
        "response": parsed,
        "raw": raw,
        "history": history,
    }


def continue_consultation(patient_message: str, history: list, turn: int) -> dict:
    """
    Continue an existing consultation.

    Args:
        patient_message: What the patient just said.
        history: Previous chat history (list of {role, content}).
        turn: Current question number (0-indexed).

    Returns:
        Dict with doctor response, parsed JSON, and updated history.
    """
    # After 5 turns push toward assessment
    suffix = ""
    if turn >= 5:
        suffix = (
            " You now have sufficient information. "
            "Provide your final clinical assessment in the assessment_ready: true JSON format."
        )

    user_message = patient_message + suffix

    # Build full messages list: system prompt + conversation history + new user message
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    raw = _call_groq(messages)
    parsed = _safe_parse(raw)

    # Append the new exchange to history
    updated_history = history + [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": raw},
    ]

    return {
        "turn": turn + 1,
        "response": parsed,
        "raw": raw,
        "history": updated_history,
        "assessment_ready": parsed.get("assessment_ready", False),
    }


# ── Helpers ──────────────────────────────────────────────────────────────────

def _safe_parse(text: str) -> dict:
    """Extract and parse JSON from model output, handling markdown fences."""
    # Strip ```json ... ``` fences
    clean = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
    # Find first { ... } block
    match = re.search(r"\{[\s\S]*\}", clean)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    # Fallback — wrap raw text as a question
    return {
        "assessment_ready": False,
        "question": text,
        "empathy_note": "",
    }


def _new_session_id() -> str:
    return f"doc_{datetime.now().strftime('%Y%m%d%H%M%S')}"


def get_emergency_info(level: int) -> dict:
    """Return colour, label and action for an emergency level (1-5)."""
    return EMERGENCY_LEVELS.get(level, EMERGENCY_LEVELS[3])