import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  Heart,
  Lightbulb,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Square,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { OrganItem, ORGANS_DATA } from '../types/anatomy';
import { soundEngine } from '../audio/soundEffects';

interface OrganCardModalProps {
  organ: OrganItem;
  onClose: () => void;
  onSelectOrgan: (organId: string) => void;
  isSidePanel?: boolean;
}

export const OrganCardModal: React.FC<OrganCardModalProps> = ({
  organ,
  onClose,
  onSelectOrgan,
  isSidePanel = false,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [largeText, setLargeText] = useState(false);
  const [isPlayingOrganSound, setIsPlayingOrganSound] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Stop speaking if organ changes or unmounts
  useEffect(() => {
    soundEngine.stopSpeech();
    setIsSpeaking(false);
    setIsPlayingOrganSound(false);

    // Play tactile click sound on organ focus
    soundEngine.playClick();
  }, [organ.id]);

  const sameDiagramOrgans = ORGANS_DATA.filter((o) => o.diagram === organ.diagram);
  const currentIndex = sameDiagramOrgans.findIndex((o) => o.id === organ.id);
  const prevOrgan =
    sameDiagramOrgans[(currentIndex - 1 + sameDiagramOrgans.length) % sameDiagramOrgans.length];
  const nextOrgan = sameDiagramOrgans[(currentIndex + 1) % sameDiagramOrgans.length];

  // Speech narration of organ information
  const toggleSpeech = () => {
    if (isSpeaking) {
      soundEngine.stopSpeech();
      setIsSpeaking(false);
    } else {
      const narrative = `${organ.name}. ${organ.shortDescription}. ${organ.role}. Πώς λειτουργεί: ${organ.howItWorks}. Ήξερες ότι: ${organ.funFact}. Συμβουλή υγείας: ${organ.kidAdvice}`;
      setIsSpeaking(true);
      soundEngine.speakText(narrative, {
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
              <h3 className="font-bold text-sm text-white truncate">{organ.name}</h3>
              <span className="text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800 hidden sm:inline">
                {organ.systemName}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate">{organ.shortDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleSpeech}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1"
            title="Διαβάστε μου"
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
            title="Ανάπτυξη καρτέλας"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Αναλυτικά</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Κλείσιμο"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. REGULAR FULL CARD (Sidebar on desktop xl, or non-overlapping bottom sheet on tablet/mobile)
  return (
    <aside
      aria-label={`Πληροφορίες για το όργανο: ${organ.name}`}
      className={
        isSidePanel
          ? 'relative w-full h-full flex flex-col bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden'
          : 'fixed bottom-14 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl max-h-[50vh] flex flex-col bg-slate-900/95 border border-cyan-500/50 rounded-2xl shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 pointer-events-auto'
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
                {organ.name}
              </h2>
              <span className="text-[11px] text-slate-400 font-semibold italic hidden sm:inline">
                ({organ.englishName})
              </span>
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              {organ.systemName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Text Size Toggle for kids with reading needs */}
          <button
            onClick={() => setLargeText(!largeText)}
            title={largeText ? 'Κανονικό μέγεθος κειμένου' : 'Μεγαλύτερο κείμενο'}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-bold"
          >
            {largeText ? 'Α-' : 'Α+'}
          </button>

          {/* Minimize toggle on bottom sheet */}
          {!isSidePanel && (
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Ελαχιστοποίηση καρτέλας"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-300 text-slate-400 transition-colors"
            title="Κλείσιμο καρτέλας"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice & Sound Control Bar */}
      <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={toggleSpeech}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
            isSpeaking
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }`}
          title="Άκουσε την περιγραφή φωναχτά"
        >
          {isSpeaking ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Διακοπή Ομιλίας</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>🔊 Διαβάστε μου!</span>
            </>
          )}
        </button>

        {/* Speed button & sound effect button */}
        <div className="flex items-center gap-2">
          {/* Play anatomical sound effect */}
          <button
            onClick={handlePlayOrganSound}
            disabled={isPlayingOrganSound}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isPlayingOrganSound
                ? 'bg-rose-500/30 border-rose-500 text-rose-300 scale-105'
                : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
            title="Άκουσε τον φυσικό ήχο του οργάνου"
          >
            {organ.soundType === 'heartbeat' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
            <span>
              {organ.soundType === 'heartbeat'
                ? 'Χτύπος ❤️'
                : organ.soundType === 'breathing'
                ? 'Αναπνοή 🫁'
                : organ.soundType === 'brain'
                ? 'Σκέψη 🧠'
                : 'Ήχος 🎵'}
            </span>
          </button>

          {/* Speech Rate toggle */}
          <button
            onClick={() => setSpeechRate(speechRate === 0.9 ? 0.75 : 0.9)}
            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            title="Ταχύτητα ομιλίας"
          >
            {speechRate === 0.9 ? '1.0x' : '0.8x (Αργά)'}
          </button>
        </div>
      </div>

      {/* Scrollable Information Body */}
      <div className={`p-4 overflow-y-auto space-y-3.5 flex-1 ${largeText ? 'text-base' : 'text-sm'}`}>
        {/* Short Summary pill */}
        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 font-medium leading-relaxed">
          ✨ {organ.shortDescription}
        </div>

        {/* Primary Role / Function */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ποια είναι η λειτουργία του;</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-normal bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            {organ.role}
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <span className="text-xs">⚙️</span>
            <span>Πώς λειτουργεί;</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-normal bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            {organ.howItWorks}
          </p>
        </div>

        {/* Fun Fact for 10-year-olds */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Ήξερες ότι...;</span>
          </div>
          <p className="text-amber-100/90 leading-relaxed font-medium">
            {organ.funFact}
          </p>
        </div>

        {/* Advice for healthy kids */}
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
              Συμβουλή για γερό σώμα:
            </span>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              {organ.kidAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Organ Pager */}
      <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => onSelectOrgan(prevOrgan.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="truncate max-w-[100px]">{prevOrgan.name}</span>
        </button>

        <span className="text-[11px] text-slate-500 font-medium">
          {currentIndex + 1} από {sameDiagramOrgans.length}
        </span>

        <button
          onClick={() => onSelectOrgan(nextOrgan.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <span className="truncate max-w-[100px]">{nextOrgan.name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
