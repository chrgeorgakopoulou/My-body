import React, { useState } from 'react';
import { Copy, Check, FileText, X, Lightbulb, BookOpen } from 'lucide-react';
import { TEACHER_PROMPT_TEXT } from '../types/anatomy';
import { soundEngine } from '../audio/soundEffects';

interface PromptModalProps {
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(TEACHER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600/30 to-indigo-600/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xl">
              📋
            </span>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Αναλυτική Εντολή (Prompt) για Εκπαιδευτικούς
              </h2>
              <span className="text-xs text-cyan-300 font-semibold">
                Έτοιμο κείμενο εντολής για AI ή ανάπτυξη εκπαιδευτικού λογισμικού
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-cyan-200">
              Ζητήσατε μια <strong>λεπτομερή εντολή (prompt)</strong> για τη δημιουργία της εφαρμογής.
              Παρακάτω βρίσκεται το πλήρες, επαγγελματικά δομημένο prompt που καλύπτει όλες τις προδιαγραφές (3D μοντέλο 360°, ήχο, προσβασιμότητα για παιδιά 10 ετών, κουίζ και ανατομία).
            </p>
          </div>

          {/* Prompt Box */}
          <div className="relative">
            <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono whitespace-pre-wrap select-all leading-relaxed overflow-x-auto max-h-[340px]">
              {TEACHER_PROMPT_TEXT}
            </pre>
          </div>

          {/* Prompt Breakdown Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="block font-bold text-xs text-cyan-300 mb-1">
                🎮 1. Διαδραστικότητα 3D
              </span>
              <p className="text-xs text-slate-400">
                Πλήρης περιστροφή 360°, zoom, εστίαση κάμερας σε όργανα, και λειτουργία Exploded View.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="block font-bold text-xs text-cyan-300 mb-1">
                🔊 2. Ήχος & Προσβασιμότητα
              </span>
              <p className="text-xs text-slate-400">
                Φωνητική ανάγνωση στα Ελληνικά με ρυθμιζόμενη ταχύτητα και φυσικοί ήχοι (καρδιά, αναπνοή).
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {copied ? '✅ Αντιγράφηκε στο πρόχειρο!' : 'Μπορείτε να το αντιγράψετε με 1 κλικ.'}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Αντιγράφηκε!' : 'Αντιγραφή Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
