import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  RotateCw,
  Eye,
  Layers,
  Sparkles,
  Sliders,
  Maximize2,
  Activity,
  Heart,
} from 'lucide-react';
import { BodySystem, BODY_SYSTEMS, ORGANS } from '../types/anatomy';
import { soundEngine } from '../audio/soundEffects';

interface ControlDockProps {
  selectedOrganId: string | null;
  onSelectOrgan: (organId: string | null) => void;
  activeSystem: BodySystem;
  onSelectSystem: (system: BodySystem) => void;
  skinMode: 'xray' | 'ghost' | 'hidden';
  onSetSkinMode: (mode: 'xray' | 'ghost' | 'hidden') => void;
  explodedRatio: number;
  onExplodedChange: (val: number) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  viewFocus: 'full' | 'torso' | 'head';
  onSetViewFocus: (focus: 'full' | 'torso' | 'head') => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  selectedOrganId,
  onSelectOrgan,
  activeSystem,
  onSelectSystem,
  skinMode,
  onSetSkinMode,
  explodedRatio,
  onExplodedChange,
  isAutoRotate,
  onToggleAutoRotate,
  onResetCamera,
  viewFocus,
  onSetViewFocus,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'organs' | 'systems' | 'view'>('organs');

  const handleOrganClick = (organId: string) => {
    soundEngine.playClick();
    if (selectedOrganId === organId) {
      onSelectOrgan(null);
    } else {
      onSelectOrgan(organId);
    }
  };

  const handleSystemClick = (sys: BodySystem) => {
    soundEngine.playClick();
    onSelectSystem(sys);
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-[940px] px-3 sm:px-4 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'translate-y-[calc(100%-46px)]' : 'translate-y-0'
      }`}
    >
      <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Top Dock Header Bar & Collapse Button */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/70 border-b border-slate-800">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setActiveTab('organs');
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'organs'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              🫀 Όργανα
            </button>
            <button
              onClick={() => {
                setActiveTab('systems');
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'systems'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              🔄 Συστήματα
            </button>
            <button
              onClick={() => {
                setActiveTab('view');
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'view'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              ⚙️ Προβολή & 3D
            </button>
          </div>

          {/* Quick Actions (Reset camera, auto-rotate, collapse) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onResetCamera();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Επαναφορά προβολής σε όλο το σώμα"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Επαναφορά</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleAutoRotate();
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isAutoRotate
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={isAutoRotate ? 'Παύση περιστροφής' : 'Αυτόματη περιστροφή'}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors ml-1"
              title={isCollapsed ? 'Εμφάνιση χειριστηρίων' : 'Απόκρυψη χειριστηρίων'}
            >
              {isCollapsed ? (
                <>
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                  <span className="hidden md:inline">Εμφάνιση</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                  <span className="hidden md:inline">Απόκρυψη</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Focus Mode Quick Bar (Σώμα kardia1 vs Διατομή Κεφαλιού vs Πλήρες Σώμα) */}
        <div className="bg-slate-950/90 px-3.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Απεικόνιση 3D:
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => {
                soundEngine.playClick();
                onSetViewFocus('torso');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all border ${
                viewFocus === 'torso'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🫀 Σώμα & Όργανα (kardia1)
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onSetViewFocus('head');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all border ${
                viewFocus === 'head'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🧠 Διατομή Κεφαλιού (Εικ. 2)
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onSetViewFocus('full');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all border ${
                viewFocus === 'full'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🧍 Πλήρες Σώμα
            </button>
          </div>
        </div>

        {/* Tab 1: Quick Organ Selector Pills */}
        {activeTab === 'organs' && (
          <div className="p-2.5 sm:p-3 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-1">
              {ORGANS.map((organ) => {
                const isSelected = selectedOrganId === organ.id;
                return (
                  <button
                    key={organ.id}
                    onClick={() => handleOrganClick(organ.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-base">{organ.icon}</span>
                    <span>{organ.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: System Filters */}
        {activeTab === 'systems' && (
          <div className="p-2.5 sm:p-3 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-1">
              {BODY_SYSTEMS.map((sys) => {
                const isSelected = activeSystem === sys.id;
                return (
                  <button
                    key={sys.id}
                    onClick={() => handleSystemClick(sys.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>{sys.icon}</span>
                    <span>{sys.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: 3D View Settings & Exploded View Slider */}
        {activeTab === 'view' && (
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Skin Visibility Modes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Προβολή Σώματος:</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSetSkinMode('xray');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    skinMode === 'xray'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ⚡ Ακτινογραφία
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSetSkinMode('ghost');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    skinMode === 'ghost'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  👤 Διαφανές
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSetSkinMode('hidden');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    skinMode === 'hidden'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  🫀 Μόνο Όργανα
                </button>
              </div>
            </div>

            {/* Exploded View Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Αποσυναρμολόγηση (Exploded):</span>
                </span>
                <span className="text-cyan-400 font-mono">
                  {Math.round(explodedRatio * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Ενιαίο</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedRatio}
                  onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[11px] text-slate-400">Διαχωρισμένο</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
