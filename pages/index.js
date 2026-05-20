import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, MapPin, Zap, Lock, Download, ClipboardCheck } from 'lucide-react';

const AGGRESSION_LEVELS = {
  1: "Compliant but Reluctant (Verbal hesitation, closed body language)",
  2: "Passive Resistance (Limp, refuses to move, dead weight)",
  3: "Active Verbal Resistance (Shouting, threats, challenging authority)",
  4: "Active Physical Resistance (Pulling away, non-violent struggling)",
  5: "Active Violence (Strikes, bites, headbutts, trying to harm)",
  6: "Medical Crisis (Seizure, diabetic episode, incoherent speech)"
};

export default function ScenarioApp() {
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, level }),
      });
      const data = await response.json();
      setResult(data.output);
    } catch (error) {
      alert("Error generating scenario. Check your API settings.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <header className="max-w-3xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-4"><Shield size={48} className="text-blue-600" /></div>
        <h1 className="text-3xl font-bold tracking-tight">Scenario Architect</h1>
        <p className="text-slate-600 mt-2">Generate professional, legally-defensible training briefings in seconds.</p>
      </header>

      <main className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10">
        <div className="space-y-8">
          {/* Input 1: Location */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <MapPin size={16} /> 1. Operational Location
            </label>
            <input 
              type="text" 
              placeholder="e.g. Hospital A&E, Prison Wing, Visit Hall"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Input 2: Aggression Slider */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Zap size={16} /> 2. Aggression Level: {level}
            </label>
            <input 
              type="range" min="1" max="6" step="1"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
            <p className="mt-2 text-sm italic text-blue-700 font-medium">{AGGRESSION_LEVELS[level]}</p>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleGenerate}
            disabled={loading || !location}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Weaponizing Scenario..." : "Generate Professional Package"}
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className="mt-12 p-6 bg-slate-50 border-t-4 border-blue-600 rounded-lg whitespace-pre-wrap font-mono text-sm leading-relaxed">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Training Briefing Package</h2>
                <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-xs bg-white border border-slate-300 px-3 py-1 rounded flex items-center gap-1 hover:bg-slate-100"
                >
                    <ClipboardCheck size={14} /> Copy Briefing
                </button>
            </div>
            {result}
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-400 text-xs">
        <p>© Scenario Architect - Built for Professional Instructors</p>
      </footer>
    </div>
  );
}
