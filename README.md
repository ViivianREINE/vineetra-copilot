# 🏥 Vineetra — India’s AI Clinical Copilot

Vineetra is a next-generation AI-powered Emergency Triage & Clinical Decision System designed to scale across India. Built for both urban hospitals and rural clinics, it leverages real-time speech-to-text (in 21 Indian languages), emotion intelligence, and Claude Sonnet-backed clinical reasoning to auto-generate SOAP notes and instantly classify emergency risk.

## 🏆 Hackathon Pitch & Edge
* **The Problem**: 70% of India's population is rural, with extreme doctor shortages. ERs are overcrowded, and triaging is manual and error-prone.
* **Our Solution (Vineetra)**: An AI copilot that listens to the patient in their native tongue (e.g. Hindi, Tamil, Kannada), detects panic/pain in their voice, instantly triages them (ESI scale 1-5), and generates a structured medical note for the doctor.
* **The Business Edge**: 
  - Cost Optimization: ~₹2 per consultation.
  - Multilingual: 21 Indic languages supported (via Whisper/Deepgram models).
  - High Speed: Server-Sent Events (SSE) streaming ensures <2 sec latency.

## 🧠 System Architecture

1. **Speech Layer**: Web Speech API / Whisper STT captures patient audio in native language.
2. **Streaming Backend**: Node.js + Express acts as an orchestrator.
3. **ML Intelligence Service (Python/FastAPI)**:
   - *Emotion Analysis*: NLP/Audio features detect distress.
   - *Clinical Reasoning*: Claude Sonnet (or mock for demo) predicts top 3 diseases.
   - *Triage Engine*: Classifies risk as LOW, MEDIUM, HIGH, or CRITICAL.
4. **UI Layer**: React + Tailwind + Framer Motion delivers a calm, trustworthy interface for doctors.

## 🚀 Setup & Run Instructions

### 1. Python ML Service (Port 8000)
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

### 2. Node.js Orchestrator (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 3. React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment Guide
- **Frontend**: Deploy `frontend/` to **Vercel** (`npm run build`).
- **Backend**: Deploy `backend/` to **Render** Web Service.
- **ML Models**: Deploy `ml-service/` to **Render** or **Railway** using the provided `requirements.txt`.

*Built with ❤️ for mothers and patients everywhere.*
