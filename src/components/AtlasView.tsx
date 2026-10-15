import React, { useState } from 'react';
import { Volume2, Sparkles, Eye, EyeOff, X, ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import { ORGANS, OrganData } from '../types/anatomy';
import { soundEngine } from '../audio/soundEffects';

interface AtlasViewProps {
  onClose: () => void;
  onSelectOrganIn3D: (organId: string) => void;
}

export const AtlasView: React.FC<AtlasViewProps> = ({ onClose, onSelectOrganIn3D }) => {
  const [activeChart, setActiveChart] = useState<'torso' | 'head'>('torso');
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>('heart');
  const [hideLabelsForTest, setHideLabelsForTest] = useState<boolean>(false);

  const torsoOrgans = ORGANS.filter((o) => o.atlasCoordinates?.view === 'torso');
  const headOrgans = ORGANS.filter((o) => o.atlasCoordinates?.view === 'head');
  const currentOrgans = activeChart === 'torso' ? torsoOrgans : headOrgans;

  const currentSelectedOrgan = ORGANS.find((o) => o.id === selectedOrganId) || currentOrgans[0];

  const handleOrganClick = (organ: OrganData) => {
    setSelectedOrganId(organ.id);
    soundEngine.playOrganSound(organ.soundType);
  };

  const handleSpeak = (organ: OrganData) => {
    soundEngine.speakText(`${organ.name}. ${organ.shortDescription}. ${organ.role}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-cyan-900/40 via-slate-900 to-indigo-900/40 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xl">
              📖
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                Σχολικός Ανατομικός Άτλαντας
              </h2>
              <p className="text-[11px] text-cyan-300 font-medium">
                Ακολουθεί πιστά τα διαγράμματα του σχολικού βιβλίου Ε' Δημοτικού
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Self-test toggle */}
            <button
              onClick={() => setHideLabelsForTest(!hideLabelsForTest)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                hideLabelsForTest
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Κρύψε τις ετικέτες για να δοκιμάσεις τις γνώσεις σου"
            >
              {hideLabelsForTest ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {hideLabelsForTest ? 'Λειτουργία Εξέτασης (Ενεργή)' : 'Κρύψε Ετικέτες'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch between the 2 uploaded textbook diagrams */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveChart('torso');
              setSelectedOrganId('heart');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeChart === 'torso'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>🫀 Εικόνα 1: Εσωτερικά Όργανα Θώρακα & Κοιλιάς</span>
          </button>

          <button
            onClick={() => {
              setActiveChart('head');
              setSelectedOrganId('brain_cerebrum');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeChart === 'head'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>🧠 Εικόνα 2: Ανατομική Διατομή Κεφαλιού</span>
          </button>
        </div>

        {/* Main Body (Split View: Illustrated Diagram on Left, Organ Info on Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Diagram Column */}
          <div className="lg:col-span-7 bg-slate-950/70 p-4 flex flex-col items-center justify-center relative overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800">
            {activeChart === 'torso' ? (
              /* Torso Diagram matching kardia1.jpg */
              <div className="relative w-full max-w-[440px] aspect-[4/5] bg-slate-900/90 rounded-2xl border border-slate-800 p-2 shadow-inner select-none">
                <svg viewBox="0 0 400 480" className="w-full h-full">
                  {/* Human Torso Outline */}
                  <path
                    d="M 130 30 Q 150 10 200 10 Q 250 10 270 30 L 290 80 Q 360 100 370 170 L 330 240 L 320 450 Q 200 470 80 450 L 70 240 L 30 170 Q 40 100 110 80 Z"
                    fill="#fed7aa"
                    fillOpacity="0.15"
                    stroke="#fdba74"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />

                  {/* Larynx & Thyroid */}
                  <g className="cursor-pointer" onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'larynx_thyroid')!)}>
                    <rect x="186" y="50" width="28" height="20" rx="4" fill="#f43f5e" />
                    <path d="M 180 62 Q 200 68 220 62 Q 215 80 200 76 Q 185 80 180 62 Z" fill="#fb7185" />
                  </g>

                  {/* Trachea */}
                  <g className="cursor-pointer" onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'trachea')!)}>
                    <rect x="190" y="74" width="20" height="52" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="190" y1="84" x2="210" y2="84" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="190" y1="94" x2="210" y2="94" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="190" y1="104" x2="210" y2="104" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="190" y1="114" x2="210" y2="114" stroke="#64748b" strokeWidth="1.5" />
                  </g>

                  {/* Right Lung (ΔΕ) - 3 lobes */}
                  <path
                    d="M 182 120 C 140 110 110 140 110 200 C 110 250 150 260 185 240 Z"
                    fill="#38bdf8"
                    fillOpacity="0.75"
                    stroke="#0284c7"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'lungs')!)}
                  />

                  {/* Left Lung (ΑΡ) - 2 lobes with cardiac notch */}
                  <path
                    d="M 218 120 C 260 110 290 140 290 200 C 290 250 250 260 215 240 C 230 210 230 160 218 120 Z"
                    fill="#38bdf8"
                    fillOpacity="0.75"
                    stroke="#0284c7"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'lungs')!)}
                  />

                  {/* Heart in center tilted left */}
                  <g className="cursor-pointer hover:scale-105 transition-transform" onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'heart')!)}>
                    <path
                      d="M 195 160 C 180 140 165 170 185 205 L 205 225 L 225 205 C 245 170 230 140 215 160 Z"
                      fill="#be123c"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    {/* Aorta arch */}
                    <path d="M 200 160 Q 200 135 215 140" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                  </g>

                  {/* Liver (Ήπαρ) */}
                  <path
                    d="M 130 240 C 170 230 230 235 245 250 L 250 290 C 220 310 150 315 125 270 Z"
                    fill="#991b1b"
                    stroke="#b91c1c"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'liver')!)}
                  />

                  {/* Gallbladder (Χοληδόχος κύστη) */}
                  <ellipse
                    cx="185"
                    cy="300"
                    rx="8"
                    ry="12"
                    fill="#15803d"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'gallbladder')!)}
                  />

                  {/* Stomach (Στομάχι) */}
                  <path
                    d="M 215 255 C 245 250 270 270 265 305 C 260 330 230 335 210 320 C 215 295 210 275 215 255 Z"
                    fill="#f59e0b"
                    stroke="#d97706"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'stomach')!)}
                  />

                  {/* Pancreas (Πάγκρεας) */}
                  <path
                    d="M 180 315 Q 220 310 245 325 Q 230 335 180 325 Z"
                    fill="#eab308"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'pancreas')!)}
                  />

                  {/* Large Intestine (Παχύ έντερο) */}
                  <path
                    d="M 130 400 L 130 330 Q 200 325 270 330 L 270 410"
                    fill="none"
                    stroke="#b45309"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cursor-pointer"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'large_intestine')!)}
                  />

                  {/* Small Intestine (Λεπτό έντερο) */}
                  <g className="cursor-pointer" onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'small_intestine')!)}>
                    <circle cx="200" cy="375" r="34" fill="#fb923c" fillOpacity="0.85" stroke="#f97316" strokeWidth="2" />
                    <path d="M 180 365 Q 200 355 220 365 Q 200 375 180 385 Q 200 395 220 385" fill="none" stroke="#ea580c" strokeWidth="4" />
                  </g>

                  {/* Appendix (Σκωληκοειδής απόφυση) */}
                  <path
                    d="M 130 415 Q 120 435 125 445"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="cursor-pointer"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'appendix')!)}
                  />
                </svg>

                {/* Interactive Leader Labels (Exactly like kardia1.jpg) */}
                {torsoOrgans.map((organ) => {
                  const isSelected = selectedOrganId === organ.id;
                  const coords = organ.atlasCoordinates;
                  if (!coords) return null;

                  return (
                    <button
                      key={organ.id}
                      onClick={() => handleOrganClick(organ)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-md border ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400 scale-105 z-20 font-extrabold'
                          : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-cyan-500 hover:text-cyan-300 z-10'
                      }`}
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{hideLabelsForTest ? '❓' : organ.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Head Cross-Section Diagram matching Διατομή_κεφαλιού_01.jpg */
              <div className="relative w-full max-w-[440px] aspect-[4/5] bg-slate-900/90 rounded-2xl border border-slate-800 p-2 shadow-inner select-none">
                <svg viewBox="0 0 400 480" className="w-full h-full">
                  {/* Skull & Head profile */}
                  <path
                    d="M 120 420 L 120 280 Q 90 240 90 170 Q 90 50 200 40 Q 300 40 320 140 Q 330 180 300 220 Q 330 250 310 280 Q 300 320 280 340 L 260 420 Z"
                    fill="#fed7aa"
                    fillOpacity="0.2"
                    stroke="#f1f5f9"
                    strokeWidth="3"
                  />

                  {/* Brain Cerebrum (Εγκέφαλος) */}
                  <path
                    d="M 130 170 Q 120 80 200 70 Q 280 70 290 150 Q 280 200 230 200 Q 180 200 160 190 Z"
                    fill="#ec4899"
                    fillOpacity="0.8"
                    stroke="#db2777"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'brain_cerebrum')!)}
                  />

                  {/* Corpus Callosum white matter arch */}
                  <path d="M 170 170 Q 210 135 250 165" fill="none" stroke="#fdf2f8" strokeWidth="6" strokeLinecap="round" />

                  {/* Cerebellum (Παρεγκεφαλίδα with arbor vitae branches) */}
                  <g className="cursor-pointer" onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'cerebellum')!)}>
                    <circle cx="160" cy="235" r="34" fill="#a855f7" stroke="#9333ea" strokeWidth="2" />
                    {/* Tree branches */}
                    <path d="M 160 255 L 160 220 M 160 235 L 145 225 M 160 235 L 175 225 M 160 242 L 148 245 M 160 242 L 172 245" stroke="#f3e8ff" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Brainstem (Γέφυρα & Προμήκης μυελός) */}
                  <path
                    d="M 195 200 Q 210 215 205 235 L 195 285 L 180 285 L 180 220 Z"
                    fill="#06b6d4"
                    stroke="#0891b2"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'brainstem')!)}
                  />

                  {/* Pituitary gland (Υπόφυση) */}
                  <circle
                    cx="225"
                    cy="200"
                    r="7"
                    fill="#f472b6"
                    stroke="#db2777"
                    strokeWidth="2"
                    className="cursor-pointer animate-pulse"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'pituitary')!)}
                  />

                  {/* Cervical vertebrae column (Αυχενικοί σπόνδυλοι) */}
                  <g className="cursor-pointer" onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'skull_spine')!)}>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <rect key={i} x="145" y={285 + i * 18} width="22" height="13" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                    ))}
                  </g>

                  {/* Tongue & Mouth Cavity (Γλώσσα & Στόμα) */}
                  <path
                    d="M 230 260 Q 260 255 280 280 Q 250 300 230 290 Z"
                    fill="#fb7185"
                    stroke="#e11d48"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => handleOrganClick(ORGANS.find(o => o.id === 'mouth_tongue')!)}
                  />

                  {/* Pharynx & Trachea entry */}
                  <path d="M 220 300 L 220 420" fill="none" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 205 320 L 205 420" fill="none" stroke="#fca5a5" strokeWidth="10" strokeLinecap="round" />
                </svg>

                {/* Leader Labels for Head (like Διατομή_κεφαλιού_01.jpg) */}
                {headOrgans.map((organ) => {
                  const isSelected = selectedOrganId === organ.id;
                  const coords = organ.atlasCoordinates;
                  if (!coords) return null;

                  return (
                    <button
                      key={organ.id}
                      onClick={() => handleOrganClick(organ)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-md border ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400 scale-105 z-20 font-extrabold'
                          : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-cyan-500 hover:text-cyan-300 z-10'
                      }`}
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{hideLabelsForTest ? '❓' : organ.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Information Column */}
          <div className="lg:col-span-5 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-4 bg-slate-900/90">
            {currentSelectedOrgan && (
              <div className="space-y-4">
                {/* Organ title card */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30">
                      {currentSelectedOrgan.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold font-heading text-white">
                        {currentSelectedOrgan.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {currentSelectedOrgan.systemName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(currentSelectedOrgan)}
                    className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                    title="Ανάγνωση φωναχτά"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Summary */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs sm:text-sm leading-relaxed">
                  ✨ {currentSelectedOrgan.shortDescription}
                </div>

                {/* Function / Role */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Ποια είναι η λειτουργία του;
                  </span>
                  <p className="text-slate-200 text-xs sm:text-sm bg-slate-800/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {currentSelectedOrgan.role}
                  </p>
                </div>

                {/* How it works */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Πώς λειτουργεί;
                  </span>
                  <p className="text-slate-300 text-xs sm:text-sm bg-slate-800/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {currentSelectedOrgan.howItWorks}
                  </p>
                </div>

                {/* Fun fact */}
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed">
                  💡 <strong>Ήξερες ότι:</strong> {currentSelectedOrgan.funFact}
                </div>
              </div>
            )}

            {/* Jump to 3D View button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectOrganIn3D(currentSelectedOrgan.id);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-transform active:scale-95"
              >
                <span>🔍 Εστίαση στο 3D Σώμα</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
