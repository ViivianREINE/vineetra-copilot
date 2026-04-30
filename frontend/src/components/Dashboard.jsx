import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceInput from './VoiceInput';
import TriageCard from './TriageCard';
import SoapViewer from './SoapViewer';
import EmotionMeter from './EmotionMeter';

export default function Dashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('English');
  const [transcript, setTranscript] = useState('');
  
  // Streaming states
  const [emotion, setEmotion] = useState('Calm');
  const [risk, setRisk] = useState('LOW');
  const [diseases, setDiseases] = useState([]);
  const [soap, setSoap] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const startAnalysis = async (text, lang) => {
    setIsProcessing(true);
    // Reset states
    setEmotion('Calm');
    setRisk('LOW');
    setDiseases([]);
    setSoap({});
    setTranscript('');

    try {
      const response = await fetch('http://localhost:5000/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // SSE parsing
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.type === 'transcript') setTranscript(data.data);
              if (data.type === 'emotion') setEmotion(data.data);
              if (data.type === 'risk') setRisk(data.data);
              if (data.type === 'diagnosis') setDiseases(data.data);
              if (data.type === 'soap') {
                setSoap(prev => ({ ...prev, ...data.data }));
              }
              if (data.type === 'done') setIsProcessing(false);
              
            } catch (e) {
              console.error('Error parsing SSE json', e);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Input & Triage */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <VoiceInput 
          onAnalyze={startAnalysis} 
          isProcessing={isProcessing}
          language={language}
          setLanguage={setLanguage}
        />
        
        <EmotionMeter emotion={emotion} />
        
        <TriageCard risk={risk} diseases={diseases} />
      </div>

      {/* Right Column - Transcript & SOAP */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Transcript Panel */}
        <motion.div 
          layout
          className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Live Transcript
            </h3>
            {isProcessing && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
            )}
          </div>
          <div className="min-h-[120px] bg-gray-50 rounded-xl p-4 border border-gray-100">
            {transcript ? (
              <p className="text-gray-700 leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-gray-400 italic">Waiting for voice input...</p>
            )}
          </div>
        </motion.div>

        {/* SOAP Panel */}
        <SoapViewer soap={soap} isProcessing={isProcessing} />

      </div>
    </div>
  );
}
