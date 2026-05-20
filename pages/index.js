import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Zap, Lock, ClipboardCheck, CheckCircle, AlertCircle } from 'lucide-react';

const AGGRESSION_LEVELS = {
  1: "Compliant but Reluctant (Verbal hesitation, closed body)",
  2: "Passive Resistance (Limp, refuses to move, dead weight)",
  3: "Active Verbal Resistance (Shouting, threats, challenging authority)",
  4: "Active Physical Resistance (Pulling away, non-violent)",
  5: "Active Violence (Strikes, bites, trying to harm)",
  6: "Medical Crisis (Seizure, diabetic episode, distress)"
};

export default function ScenarioApp() {
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // Check if user just returned from a successful Stripe payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') {
      setIsPaid(true);
    }
  }, []);

  const handlePayment = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { url } = await res.json();
    window.location.href = url;
  };

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
      alert("Error generating. Please check your connection.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4"><Shield size={48} className="text-blue-700" /></div>
          <h1 className="text-4xl font-extrabold tracking-tight">The Scenario Architect</h1>
          <p className="text-slate-600 mt-3 text-lg">Weaponized training scenarios for professional safety instructors.</p>
        </header>

        {!isPaid ? (
          /* SALES / LOCK SCREEN */
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Lifetime Access for Training Providers</h2>
              <p className="text-slate-600 mb-8">Stop writing "crap" scenarios. Generate legally-defensible briefings, role-player instructions, and NDM-aligned debriefs in seconds.</p>
              
              <div className="space-y-4 mb-10 text-left max-w-md mx-auto">
                <div className="flex gap-3 items-start"><CheckCircle className="text-green-500 shrink-0" /> <span>Professional 10-section scenario framework</span></div>
                <div className="flex gap-3 items-start"><CheckCircle className="text-green-500 shrink-0" /> <span>Auto-generated Legal & Safety briefings</span></div>
                <div className="flex gap-3 items-start"><CheckCircle className="text-green-500 shrink-0" /> <span>Specific Role-Player "if/then" triggers</span></div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold py-5 rounded-xl transition-all shadow-lg hover:shadow-blue-200"
              >
                Get Lifetime Access (£100)
              </button>
              <p className="mt-4 text-slate-400 text-sm">One-time payment. Secure checkout via Stripe.</p>
            </div>
          </div>
        ) : (
          /* THE ACTUAL TOOL (UNLOCKED) */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
             <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-700">
                <CheckCircle size={20} /> <span className="font-semibold">Lifetime Access Active</span>
             </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 uppercase tracking-wide">
                  <MapPin size={16} /> Operational Location
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Prison Wing, A&E Ward, Custody Suite"
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 uppercase tracking-wide">
                  <Zap size={16} /> Aggression Level (1-6)
                </label>
                <input 
                  type="range" min="1" max="6" step="1"
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-blue-900 font-bold">Level {level}:</span> 
                    <span className="text-blue-800 ml-2">{AGGRESSION_LEVELS[level]}</span>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !location}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
              >
                {loading ? "Constructing Framework..." : "Generate Scenario Package"}
              </button>
            </div>

            {result && (
              <div className="mt-12 bg-slate-900 text-slate-100 p-8 rounded-2xl overflow-x-auto shadow-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white">The Briefing Package</h2>
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(result);
                            alert("Copied to clipboard!");
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-slate-700"
                    >
                        <ClipboardCheck size={18} /> Copy to Teams
                    </button>
                </div>
                <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-300">
                    {result}
                </div>
              </div>
            )}
          </div>
        )}
        
        <footer className="mt-12 text-center pb-12">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-2">
                <Lock size={14} /> Encrypted & Secure
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-widest">© MMXXIV Scenario Architect Engine</p>
        </footer>
      </div>
    </div>
  );
}
