import React from 'react';
import { motion } from 'framer-motion';

export default function SoapViewer({ soap, isProcessing }) {
  const sections = [
    { key: 'S', title: 'Subjective', color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'O', title: 'Objective', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'A', title: 'Assessment', color: 'text-purple-600', bg: 'bg-purple-50' },
    { key: 'P', title: 'Plan', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <motion.div 
      layout
      className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex-grow"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Clinical SOAP Note
        </h3>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div key={section.key} className={`p-4 rounded-xl border border-gray-100 ${section.bg}`}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${section.color}`}>
              <span className="bg-white px-2 py-0.5 rounded shadow-sm">{section.key}</span>
              {section.title}
            </h4>
            <div className="min-h-[80px] bg-white/60 rounded-lg p-3 backdrop-blur-sm border border-white/50">
              {soap[section.key] ? (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-gray-700 text-sm leading-relaxed"
                >
                  {soap[section.key]}
                </motion.p>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 text-sm italic h-full">
                  {isProcessing ? 'Generating...' : 'Pending...'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
