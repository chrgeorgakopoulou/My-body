import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  Heart,
  Lightbulb,
  ShieldCheck,
  X,
  Square,
  Minimize2,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { OrganItem } from '../types/anatomy';
import { soundEngine } from '../audio/soundEffects';
import { getRealOrganSpecimen } from '../data/realOrganData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface OrganCardModalProps {
  organ: OrganItem;
  onClose: () => void;
  onSelectOrgan: (organId: string) => void;
  isSidePanel?: boolean;
  lang: Language;
}

export const OrganCardModal: React.FC<OrganCardModalProps> = ({
  organ,
  onClose,
  isSidePanel = false,
  lang,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [largeText, setLargeText] = useState(false);
  const [isPlayingOrganSound, setIsPlayingOrganSound] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const specimen = getRealOrganSpecimen(organ.id);

  const displayName = isEn ? organ.englishName : organ.name;
  const secondaryName = isEn ? organ.name : organ.englishName;
  const displaySystem = isEn ? organ.systemNameEn : organ.systemName;
  const displayShort = isEn ? organ.shortDescriptionEn : organ.shortDescription;
  const displayRole = isEn ? organ.roleEn : organ.role;
  const displayHow = isEn ? organ.howItWorksEn : organ.howItWorks;
  const displayFun = isEn ? organ.funFactEn : organ.funFact;
  const displayAdvice = isEn ? organ.kidAdviceEn : organ.kidAdvice;

  // Cleanup speech when unmounting or switching organs
  useEffect(() => {
    return () => {
      soundEngine.stopSpeech();
    };
  }, [organ.id]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      soundEngine.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${displayName}. ${displayShort} ${displayRole} ${displayHow}`;
      soundEngine.speakText(textToRead, {
        lang,
        rate: speechRate,
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  const handlePlayOrganSound = () => {
    setIsPlayingOrganSound(true);
    soundEngine.playOrganSound(organ.soundType);
    setTimeout(() => setIsPlayingOrganSound(false), 1400);
  };

  // 1. MINIMIZED SLIM DOCK BANNER (For compact screens when minimized)
  if (isMinimized && !isSidePanel) {
    return (
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl px-4 py-2 bg-slate-900/95 border border-cyan-500/50 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-slate-100 animate-in fade-in slide-in-from-bottom-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0">{organ.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white truncate">{displayName}</h3>
              <span className="text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800 hidden sm:inline">
                {displaySystem}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate">{displayShort}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleSpeech}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1"
            title={isSpeaking ? t.stopReading : t.readToMe}
          >
            {isSpeaking ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 flex items-center gap-1"
            title={t.expandCard}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.expandCard}</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            title={t.closeCard}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. REGULAR FULL CARD (Dedicated side-panel on wide screens, bottom drawer on mobile)
  return (
    <aside
      aria-label={`${displayName} details`}
      className={
        isSidePanel
          ? 'relative w-full h-full flex flex-col bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden'
          : 'fixed bottom-14 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl max-h-[52vh] flex flex-col bg-slate-900/95 border border-cyan-500/50 rounded-2xl shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 pointer-events-auto'
      }
    >
      {/* Top Banner Header */}
      <div
        className="relative px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0"
        style={{
          background: `linear-gradient(135deg, ${organ.color}25, rgba(15, 23, 42, 0.95))`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-2xl shadow-md border border-white/20"
            style={{ backgroundColor: `${organ.color}40` }}
          >
            {organ.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white tracking-wide">
                {displayName}
              </h2>
              <span className="text-[11px] text-slate-400 font-semibold italic hidden sm:inline">
                ({secondaryName})
              </span>
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              {displaySystem}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Text Size Toggle for kids with reading needs */}
          <button
            onClick={() => setLargeText(!largeText)}
            title={largeText ? 'Normal text size' : 'Larger text'}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-bold"
          >
            {largeText ? 'Α-' : 'Α+'}
          </button>

          {/* Minimize toggle on bottom sheet */}
          {!isSidePanel && (
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={t.minimizeCard}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-300 text-slate-400 transition-colors"
            title={t.closeCard}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Narration & Organ Sound Bar */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={toggleSpeech}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
            isSpeaking
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }`}
          title={isSpeaking ? t.stopReading : t.readToMe}
        >
          {isSpeaking ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>{t.stopReading}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t.readToMe}</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          {/* Speech Rate toggle */}
          <button
            onClick={() => setSpeechRate(speechRate === 0.9 ? 0.75 : 0.9)}
            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            title="Speech rate"
          >
            {speechRate === 0.9 ? t.normalSpeed : t.slowSpeed}
          </button>

          {/* Play authentic sound button */}
          <button
            onClick={handlePlayOrganSound}
            disabled={isPlayingOrganSound}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isPlayingOrganSound
                ? 'bg-rose-500/30 border-rose-500 text-rose-300 scale-105'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="Listen to organ sound"
          >
            {organ.soundType === 'heartbeat' && <Heart className="w-3 h-3 text-rose-400" />}
            <span>
              {organ.soundType === 'heartbeat'
                ? t.heartbeatSound
                : organ.soundType === 'breathing'
                ? t.breathingSound
                : organ.soundType === 'brain'
                ? t.brainSound
                : t.soundButton}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Information Body */}
      <div className={`p-4 overflow-y-auto space-y-3.5 flex-1 ${largeText ? 'text-base' : 'text-sm'}`}>
        {/* Short Summary pill */}
        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 font-medium leading-relaxed">
          ✨ {displayShort}
        </div>

        {/* Real Medical Specimen Card */}
        <div className="p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {t.realAnatomyBadge}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {specimen.weightOrSize}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => setShowFullPhoto(!showFullPhoto)}
              title={isEn ? 'Click to enlarge photo' : 'Κλικ για μεγέθυνση φωτογραφίας'}
            >
              <img
                src={specimen.imageSrc}
                alt={specimen.title}
                className="w-16 h-16 rounded-xl object-cover border border-emerald-500/50 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-950/30 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                🔍
              </div>
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {isEn ? `${organ.englishName} (Authentic Anatomy)` : specimen.title}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-snug mt-0.5">
                {isEn
                  ? `Natural appearance: ${specimen.tissueType}`
                  : specimen.realColorDescription}
              </p>
            </div>
          </div>

          {/* Full enlarged photo modal if clicked */}
          {showFullPhoto && (
            <div className="p-2 bg-slate-900 rounded-xl border border-emerald-500/50 space-y-2 animate-in fade-in">
              <img
                src={specimen.imageSrc}
                alt={specimen.title}
                className="w-full max-h-48 object-contain rounded-lg bg-slate-950"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>{isEn ? specimen.tissueType : specimen.medicalDescription}</span>
                <button
                  onClick={() => setShowFullPhoto(false)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  {isEn ? 'Collapse' : 'Σύμπτυξη'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Role / Function */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.roleLabel}</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-normal bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            {displayRole}
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <span className="text-xs">⚙️</span>
            <span>{t.howItWorksLabel}</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-normal bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            {displayHow}
          </p>
        </div>

        {/* Fun Fact for 10-year-olds */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{t.funFactLabel}</span>
          </div>
          <p className="text-amber-100/90 leading-relaxed font-medium">
            {displayFun}
          </p>
        </div>

        {/* Advice for healthy kids */}
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
              {t.kidAdviceLabel}
            </span>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              {displayAdvice}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
