import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Award, HelpCircle } from 'lucide-react';
import { DiagramViewer } from './components/DiagramViewer';
import { OrganCardModal } from './components/OrganCardModal';
import { QuizModal } from './components/QuizModal';
import { HelpModal } from './components/HelpModal';
import { DiagramType, ORGANS_DATA, OrganItem } from './types/anatomy';
import { soundEngine } from './audio/soundEffects';

export default function App() {
  const [activeDiagram, setActiveDiagram] = useState<DiagramType>('torso');
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>('heart');
  const [hoveredOrganId, setHoveredOrganId] = useState<string | null>(null);
  const [hideLabelsForTest, setHideLabelsForTest] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const selectedOrgan = ORGANS_DATA.find((o) => o.id === selectedOrganId) || null;
  const currentDiagramOrgans = ORGANS_DATA.filter((o) => o.diagram === activeDiagram);

  const handleDiagramChange = (type: DiagramType) => {
    soundEngine.playClick();
    setActiveDiagram(type);
    // Auto-select the hero organ of that diagram
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col select-none">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="shrink-0 px-3 py-2.5 sm:px-5 sm:py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 shadow-lg z-30">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-md font-bold text-white">
            {activeDiagram === 'torso' ? '🫀' : '🧠'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-heading text-white tracking-wide">
                BioExplorer
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                10 Ετών
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Το Ανθρώπινο Σώμα & το Κεφάλι
            </p>
          </div>
        </div>

        {/* Central Prominent Diagram Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => handleDiagramChange('torso')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeDiagram === 'torso'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🫀</span>
            <span>Σώμα & Όργανα</span>
          </button>

          <button
            onClick={() => handleDiagramChange('head')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeDiagram === 'head'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🧠</span>
            <span>Διατομή Κεφαλιού</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isMuted
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Ενεργοποίηση ήχου' : 'Σίγαση ήχου'}
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
            title="Κρύψε τις ετικέτες για να δοκιμάσεις τις γνώσεις σου!"
          >
            {hideLabelsForTest ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">
              {hideLabelsForTest ? 'Εξέταση (Ενεργή)' : 'Κρύψε Ετικέτες'}
            </span>
          </button>

          {/* Quiz Game Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsQuizOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
            title="Παίξε το παιχνίδι κουίζ!"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Κουίζ</span>
          </button>

          {/* Help Instructions */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsHelpOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            title="Οδηγίες χρήσης"
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
              />
            </div>

            {/* Non-overlapping bottom sheet on tablet and mobile */}
            <div className="xl:hidden">
              <OrganCardModal
                organ={selectedOrgan}
                onClose={() => setSelectedOrganId(null)}
                onSelectOrgan={handleSelectOrgan}
                isSidePanel={false}
              />
            </div>
          </>
        )}
      </main>

      {/* 3. BOTTOM QUICK ORGAN CHIPS SELECTOR BAR */}
      <footer className="shrink-0 bg-slate-900/90 border-t border-slate-800 px-4 py-2.5 z-20 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max mx-auto justify-center">
          <span className="text-[11px] font-bold text-slate-400 pr-1 uppercase tracking-wider hidden sm:inline">
            Όργανα:
          </span>
          {currentDiagramOrgans.map((organ) => {
            const isSelected = selectedOrganId === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => handleSelectOrgan(organ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-lg scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <span>{organ.icon}</span>
                <span>{organ.name}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* MODALS */}
      {isQuizOpen && (
        <QuizModal
          onClose={() => setIsQuizOpen(false)}
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

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
