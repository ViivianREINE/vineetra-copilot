import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'bn-IN', name: 'Bengali' },
];

export default function VoiceInput({ onAnalyze, isProcessing, language, setLanguage }) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Setup Web Speech API for hackathon-grade real-time STT
    if ('webkitSpeechRecognition' in window) {
      const rec = new window.webkitSpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      
      rec.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setInterimText(text);
      };

      rec.onend = () => {
        if (isRecording) {
          // Send to backend when speech ends
          onAnalyze(interimText, language);
          setIsRecording(false);
          setInterimText('');
        }
      };

      setRecognition(rec);
    }
  }, [isRecording, interimText, language, onAnalyze]);

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
      if (interimText) {
        onAnalyze(interimText, language);
        setInterimText('');
      }
    } else {
      if (recognition) {
        const langObj = LANGUAGES.find(l => l.name === language);
        recognition.lang = langObj ? langObj.code : 'en-US';
        recognition.start();
        setIsRecording(true);
      } else {
        alert("Speech Recognition not supported in this browser. Try Chrome.");
      }
    }
  };

  const simulateEmergency = () => {
    onAnalyze("Mujhe bohot tezz seene mein dard ho raha hai aur saans lene mein takleef hai.", "Hindi");
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Voice Input</h3>
        <select 
          className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isRecording || isProcessing}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.name}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-red-100 rounded-full"
            />
          )}
          <button
            onClick={toggleRecording}
            disabled={isProcessing && !isRecording}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200'
            } ${isProcessing && !isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>

        {isRecording && interimText && (
          <p className="text-sm text-gray-500 text-center italic w-full truncate">
            Listening: {interimText}
          </p>
        )}

        <div className="w-full flex justify-center gap-3">
          <button 
            onClick={() => onAnalyze("I have a mild headache and runny nose.", "English")}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          >
            Simulate Low Risk
          </button>
          <button 
            onClick={simulateEmergency}
            className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-100 transition-colors"
          >
            Simulate Emergency (Hindi)
          </button>
        </div>
      </div>
    </div>
  );
}
