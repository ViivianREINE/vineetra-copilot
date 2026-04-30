import React from 'react';
import { motion } from 'framer-motion';

const EMOTIONS = {
  'Calm': { color: 'bg-teal-500', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  'Distressed': { color: 'bg-yellow-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  'Panic': { color: 'bg-red-500', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
};

export default function EmotionMeter({ emotion }) {
  const currentEmotion = EMOTIONS[emotion] || EMOTIONS['Calm'];

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Patient Emotion</h3>
      <div className="flex items-center gap-4">
        <motion.div 
          key={emotion}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${currentEmotion.color} shadow-lg`}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentEmotion.icon} />
          </svg>
        </motion.div>
        <div>
          <div className="text-xl font-bold text-gray-800">{emotion}</div>
          <div className="text-xs text-gray-400 mt-1">Real-time Voice Intelligence</div>
        </div>
      </div>
    </div>
  );
}
