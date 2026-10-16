import React from 'react';
import { MousePointer, Eye, Volume2, X } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface HelpModalProps {
  onClose: () => void;
  lang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600/30 to-blue-600/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xl">
              💡
            </span>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                {t.helpHeading}
              </h2>
              <span className="text-xs text-cyan-300 font-semibold">
                {t.helpSubheading}
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
        <div className="p-5 sm:p-6 space-y-4 text-slate-200 text-sm overflow-y-auto max-h-[70vh]">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 text-lg">
              🫀
            </div>
            <div>
              <h3 className="font-bold text-white mb-0.5">{t.helpTip1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.helpTip1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <MousePointer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-0.5">{t.helpTip2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.helpTip2Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-0.5">{t.helpTip3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.helpTip3Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-0.5">{t.helpTip5Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.helpTip5Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
          >
            {t.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};
