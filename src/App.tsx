import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Award, HelpCircle, Globe } from 'lucide-react';
import { DiagramViewer } from './components/DiagramViewer';
import { OrganCardModal } from './components/OrganCardModal';
import { QuizModal } from './components/QuizModal';
import { HelpModal } from './components/HelpModal';
import { DiagramType, ORGANS_DATA } from './types/anatomy';
import { soundEngine } from './audio/soundEffects';
import { Language, TRANSLATIONS } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('el');
  const [activeDiagram, setActiveDiagram] = useState<DiagramType>('torso');
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>('heart');
  const [hoveredOrganId, setHoveredOrganId] = useState<string | null>(null);
  const [hideLabelsForTest, setHideLabelsForTest] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const t = TRANSLATIONS[lang];
  const selectedOrgan = ORGANS_DATA.find((o) => o.id === selectedOrganId) || null;
  const currentDiagramOrgans = ORGANS_DATA.filter((o) => o.diagram === activeDiagram);

  const handleDiagramChange = (type: DiagramType) => {
    soundEngine.playClick();
    setActiveDiagram(type);
    if (type === 'torso') {
      setSelectedOrganId('heart');
    } else {
      setSelectedOrganId('cerebrum');
    }
  };

  const handleSelectOrgan = (organId: string) => {
    setSelectedOrganId(organId);
    const organ = ORGANS_DATA.find((o) => o.id === organId);
    if (organ) {
      soundEngine.playOrganSound(organ.soundType);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleToggleLanguage = () => {
    soundEngine.playClick();
    soundEngine.stopSpeech();
    setLang((prev) => (prev === 'el' ? 'en' : 'el'));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col select-none">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="shrink-0 px-3 py-2.5 sm:px-5 sm:py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 shadow-lg z-30">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-md font-bold text-white shrink-0">
            {activeDiagram === 'torso' ? '🫀' : '🧠'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-heading text-white tracking-wide truncate">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                {t.ageBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Central Prominent Diagram Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shadow-inner shrink-0">
          <button
            onClick={() => handleDiagramChange('torso')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeDiagram === 'torso'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🫀</span>
            <span>{t.torsoTab}</span>
          </button>

          <button
            onClick={() => handleDiagramChange('head')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeDiagram === 'head'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🧠</span>
            <span>{t.headTab}</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher (Greek <-> English) */}
          <button
            onClick={handleToggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title={t.langToggleTitle}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-extrabold">{lang === 'el' ? '🇬🇧 English' : '🇬🇷 Ελληνικά'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isMuted
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700'
            }`}
            title={isMuted ? t.soundUnmuteTitle : t.soundMuteTitle}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Study / Test Mode: Hide labels */}
          <button
            onClick={() => setHideLabelsForTest(!hideLabelsForTest)}
            className={`p-2 sm:px-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              hideLabelsForTest
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={t.testModeTitle}
          >
            {hideLabelsForTest ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">
              {hideLabelsForTest ? t.testModeActive : t.testModeBtn}
            </span>
          </button>

          {/* Quiz Game Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsQuizOpen(true);
            }}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            title={t.quizTitle}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">{t.quizBtn}</span>
          </button>

          {/* Help Instructions */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsHelpOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            title={t.helpTitle}
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTERPIECE: INTERACTIVE DIAGRAM DISPLAY WITH NON-OVERLAPPING SIDEBAR */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden p-2 gap-4">
        {/* The Diagram Viewer occupies its dedicated stage with clear margins for all words */}
        <div className="flex-1 h-full w-full flex items-center justify-center min-w-0">
          <DiagramViewer
            diagram={activeDiagram}
            selectedOrganId={selectedOrganId}
            hoveredOrganId={hoveredOrganId}
            onSelectOrgan={handleSelectOrgan}
            onHoverOrgan={setHoveredOrganId}
            hideLabelsForTest={hideLabelsForTest}
            lang={lang}
          />
        </div>

        {/* Selected Organ Detail Card: Docked side-panel on wide screens (xl) - NEVER covers words */}
        {selectedOrgan && (
          <>
            <div className="hidden xl:flex w-[380px] 2xl:w-[420px] h-full max-h-[calc(100vh-140px)] shrink-0 py-1 z-30">
              <OrganCardModal
                organ={selectedOrgan}
                onClose={() => setSelectedOrganId(null)}
                onSelectOrgan={handleSelectOrgan}
                isSidePanel={true}
                lang={lang}
              />
            </div>

            {/* Non-overlapping bottom sheet on tablet and mobile */}
            <div className="xl:hidden">
              <OrganCardModal
                organ={selectedOrgan}
                onClose={() => setSelectedOrganId(null)}
                onSelectOrgan={handleSelectOrgan}
                isSidePanel={false}
                lang={lang}
              />
            </div>
          </>
        )}
      </main>

      {/* 3. BOTTOM QUICK ORGAN CHIPS SELECTOR BAR */}
      <footer className="shrink-0 bg-slate-900/90 border-t border-slate-800 px-4 py-2.5 z-20 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max mx-auto justify-center">
          <span className="text-[11px] font-bold text-slate-400 pr-1 uppercase tracking-wider hidden sm:inline">
            {lang === 'en' ? 'Organs:' : 'Όργανα:'}
          </span>
          {currentDiagramOrgans.map((organ) => {
            const isSelected = selectedOrganId === organ.id;
            const displayName = lang === 'en' ? organ.englishName : organ.name;

            return (
              <button
                key={organ.id}
                onClick={() => handleSelectOrgan(organ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-lg scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <span>{organ.icon}</span>
                <span>{displayName}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* MODALS */}
      {isQuizOpen && (
        <QuizModal
          onClose={() => setIsQuizOpen(false)}
          lang={lang}
          onFocusOrgan={(id) => {
            setIsQuizOpen(false);
            const organ = ORGANS_DATA.find((o) => o.id === id);
            if (organ) {
              setActiveDiagram(organ.diagram);
              handleSelectOrgan(id);
            }
          }}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} lang={lang} />}
    </div>
  );
}
