import os
import asyncio
import json
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Vineetra ML Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated Triage and Clinical Logic
def analyze_triage_and_emotion(text: str):
    text_lower = text.lower()
    risk = "LOW"
    emotion = "Calm"
    diseases = ["Viral Fever (70%)", "Common Cold (65%)"]
    
    if "pain" in text_lower or "hurt" in text_lower:
        emotion = "Distressed"
        risk = "MEDIUM"
        diseases = ["Musculoskeletal Strain (80%)", "Mild Infection (60%)"]
    
    if "chest" in text_lower or "heart" in text_lower or "breathe" in text_lower or "stroke" in text_lower:
        emotion = "Panic"
        risk = "CRITICAL"
        diseases = ["Myocardial Infarction (95%)", "Pulmonary Embolism (85%)", "Severe Asthma (70%)"]
        
    return {
        "risk": risk,
        "emotion": emotion,
        "diseases": diseases
    }

async def generate_clinical_stream(text: str, language: str):
    """
    Simulates the real-time processing pipeline: STT -> Emotion -> Clinical Reasoning -> SOAP
    In production, you would call Claude Sonnet API here and yield chunks.
    """
    # 1. Yield Transcript & Language
    yield json.dumps({"type": "transcript", "data": text, "language": language})
    await asyncio.sleep(0.5)
    
    # 2. Analyze Emotion & Triage
    analysis = analyze_triage_and_emotion(text)
    
    yield json.dumps({"type": "emotion", "data": analysis["emotion"]})
    await asyncio.sleep(0.5)
    
    yield json.dumps({"type": "risk", "data": analysis["risk"]})
    await asyncio.sleep(0.5)
    
    yield json.dumps({"type": "diagnosis", "data": analysis["diseases"]})
    await asyncio.sleep(1.0)
    
    # 3. Stream SOAP Note Generation
    soap_sections = {
        "S": f"Patient reports: {text}",
        "O": "Vitals pending. Visual distress noted." if analysis["risk"] in ["HIGH", "CRITICAL"] else "Patient appears stable.",
        "A": f"Probable {analysis['diseases'][0]}",
        "P": "Immediate ER transfer required." if analysis["risk"] == "CRITICAL" else "Prescribe rest and paracetamol. Monitor for 48 hours."
    }
    
    for key, val in soap_sections.items():
        yield json.dumps({"type": "soap", "data": {key: val}})
        await asyncio.sleep(0.8)
        
    yield json.dumps({"type": "done", "data": "Stream complete"})

@app.post("/api/analyze")
async def analyze_audio(request: Request):
    """
    Receives text or audio, processes it, and returns an SSE stream.
    For the hackathon, we accept text directly to bypass STT latency if needed, 
    but we format it as a stream to show real-time capabilities.
    """
    body = await request.json()
    text = body.get("text", "I am having severe chest pain and cannot breathe.")
    language = body.get("language", "English")
    
    async def event_generator():
        async for chunk in generate_clinical_stream(text, language):
            yield {"data": chunk}
            
    return EventSourceResponse(event_generator())

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Vineetra ML AI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
