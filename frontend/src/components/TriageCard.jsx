import React from 'react';
import { motion } from 'framer-motion';

const RISK_LEVELS = {
  LOW: { color: 'bg-green-100 text-green-800 border-green-200', icon: 'bg-green-500', label: 'ESI 4/5 - Non-Urgent' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'bg-yellow-500', label: 'ESI 3 - Urgent' },
  HIGH: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: 'bg-orange-500', label: 'ESI 2 - Emergent' },
  CRITICAL: { color: 'bg-red-100 text-red-800 border-red-200', icon: 'bg-red-500', label: 'ESI 1 - Resuscitation' },
};

export default function TriageCard({ risk, diseases }) {
  const config = RISK_LEVELS[risk] || RISK_LEVELS.LOW;

  return (
    <motion.div 
      layout
      className={`rounded-2xl shadow-sm border p-6 transition-colors duration-500 ${config.color}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Triage Level</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">{risk}</span>
            <span className="relative flex h-3 w-3">
              {(risk === 'HIGH' || risk === 'CRITICAL') && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.icon}`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${config.icon}`}></span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold opacity-75 bg-white/50 px-2 py-1 rounded-md">
            {config.label}
          </span>
        </div>
      </div>

      <div className="mt-6 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">Top Predictions</h4>
        {diseases && diseases.length > 0 ? (
          <ul className="space-y-2">
            {diseases.map((d, i) => (
              <li key={i} className="flex justify-between items-center text-sm font-medium">
                <span className="truncate pr-2">{d.split('(')[0]}</span>
                <span className="bg-white/80 px-2 py-0.5 rounded text-xs">
                  {d.includes('(') ? d.split('(')[1].replace(')', '') : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-70 italic">Awaiting symptoms...</p>
        )}
      </div>
    </motion.div>
  );
}
