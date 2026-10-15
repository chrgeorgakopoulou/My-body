import React from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, FileText, Award } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAtlas: () => void;
  onOpenQuiz: () => void;
  onOpenPrompt: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  onOpenAtlas,
  onOpenQuiz,
  onOpenPrompt,
  onOpenHelp,
}) => {
  return (
    <header className="fixed top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
      {/* Brand Badge */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md pointer-events-auto">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-md text-white font-bold">
          🫀
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold font-heading text-white tracking-wide">
              BioExplorer 3D
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              10 Ετών
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Το Ανθρώπινο Σώμα & τα Εσωτερικά Όργανα
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Sound Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-lg ${
            isMuted
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              : 'bg-slate-900/90 border-slate-700/80 hover:bg-slate-800 text-cyan-300'
          }`}
          title={isMuted ? 'Ενεργοποίηση ήχου' : 'Σίγαση ήχου'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="hidden md:inline">{isMuted ? 'Σίγαση' : 'Ήχος'}</span>
        </button>

        {/* School Atlas Diagrams Button (from user images) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAtlas();
          }}
          className="px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/60 hover:bg-cyan-900/80 text-cyan-200 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
          title="Διαδραστικά Σχολικά Διαγράμματα (Εικόνες 1 & 2)"
        >
          <span className="text-sm">📖</span>
          <span className="hidden sm:inline">Σχολικός Άτλαντας</span>
        </button>

        {/* Prompt Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenPrompt();
          }}
          className="px-3 py-2 rounded-xl bg-indigo-950/70 border border-indigo-500/50 hover:bg-indigo-900/80 text-indigo-200 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
          title="Δείτε και αντιγράψτε τη λεπτομερή εντολή (Prompt)"
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Αναλυτικό Prompt</span>
        </button>

        {/* Quiz Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenQuiz();
          }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          title="Παίξε το παιχνίδι κουίζ!"
        >
          <Award className="w-4 h-4" />
          <span>Κουίζ</span>
        </button>

        {/* Help Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenHelp();
          }}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
          title="Οδηγίες χρήσης για το 3D"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline">Οδηγίες</span>
        </button>
      </div>
    </header>
  );
};
