import React from 'react';
import { ORGANS_DATA, DiagramType } from '../types/anatomy';
import { Language } from '../i18n/translations';

interface DiagramViewerProps {
  diagram: DiagramType;
  selectedOrganId: string | null;
  hoveredOrganId: string | null;
  onSelectOrgan: (organId: string) => void;
  onHoverOrgan: (organId: string | null) => void;
  hideLabelsForTest: boolean;
  lang: Language;
}

const TORSO_IMAGE_URL = '/src/assets/images/torso_anatomy_real_1792091699229.jpg';
const HEAD_IMAGE_URL = '/src/assets/images/head_anatomy_real_1792091699857.jpg';

export const DiagramViewer: React.FC<DiagramViewerProps> = ({
  diagram,
  selectedOrganId,
  hoveredOrganId,
  onSelectOrgan,
  onHoverOrgan,
  hideLabelsForTest,
  lang,
}) => {
  const currentOrgans = ORGANS_DATA.filter((o) => o.diagram === diagram);
  const activeImage = diagram === 'torso' ? TORSO_IMAGE_URL : HEAD_IMAGE_URL;
  const isTorso = diagram === 'torso';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 select-none overflow-x-auto overflow-y-hidden">
      {/* Outer container guaranteeing dedicated left and right margins for the labels */}
      <div className="relative flex items-center justify-center px-28 sm:px-36 md:px-44 lg:px-52 py-2 h-full max-h-[calc(100vh-140px)]">
        {/* Central Anatomical Frame */}
        <div
          className={`relative h-full max-h-[calc(100vh-160px)] rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-700/80 bg-slate-950 flex items-center justify-center ${
            isTorso ? 'aspect-[3/4]' : 'aspect-square'
          }`}
        >
          {/* Photorealistic Anatomical Image ("Σχεδόν αληθινή εικόνα") */}
          <img
            src={activeImage}
            alt={isTorso ? 'Human Body Anatomy' : 'Head Cross-Section'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center rounded-2xl sm:rounded-3xl select-none"
          />

          {/* Soft edge vignette */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10 shadow-[inset_0_0_50px_rgba(2,6,23,0.7)]" />

          {/* Vector SVG Overlay with Leader Lines and Non-Blinking Steady Pins */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20"
          >
            <defs>
              <filter id="steadyGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {currentOrgans.map((organ) => {
              const isSelected = selectedOrganId === organ.id;
              const isHovered = hoveredOrganId === organ.id;

              const px = organ.pin.x;
              const py = organ.pin.y;
              const isLeft = organ.label.side === 'left';

              // Connector start point just outside the image border
              const anchorX = isLeft ? -2 : 102;
              const anchorY = organ.label.y;

              // Clean elbow line coordinates
              const elbowX = isLeft ? (px < 45 ? px - 4 : 2) : (px > 55 ? px + 4 : 98);

              const strokeColor = isSelected
                ? '#38bdf8'
                : isHovered
                ? '#22d3ee'
                : 'rgba(203, 213, 225, 0.75)';
              const strokeWidth = isSelected ? 0.65 : isHovered ? 0.5 : 0.35;

              return (
                <g key={organ.id} className="transition-all duration-150">
                  {/* Connecting Leader Line from Label Badge into Organ Pin */}
                  <path
                    d={`M ${anchorX} ${anchorY} L ${elbowX} ${anchorY} L ${px} ${py}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isSelected ? 'none' : '0.8 0.8'}
                    opacity={isSelected ? 1 : isHovered ? 0.95 : 0.75}
                    filter={isSelected ? 'url(#steadyGlow)' : undefined}
                  />

                  {/* Label anchor dot */}
                  <circle
                    cx={anchorX}
                    cy={anchorY}
                    r={isSelected ? 1.0 : 0.7}
                    fill={isSelected ? '#38bdf8' : organ.color}
                    stroke="#ffffff"
                    strokeWidth="0.3"
                  />

                  {/* Steady Organ Pin Ring on Selected (NO BLINKING / NO ANIMATE-PING) */}
                  {isSelected && (
                    <circle
                      cx={px}
                      cy={py}
                      r="2.2"
                      fill="rgba(56, 189, 248, 0.25)"
                      stroke="#38bdf8"
                      strokeWidth="0.45"
                    />
                  )}

                  {/* Hover ring (subtle, steady) */}
                  {isHovered && !isSelected && (
                    <circle
                      cx={px}
                      cy={py}
                      r="1.7"
                      fill="rgba(34, 211, 238, 0.2)"
                      stroke="#22d3ee"
                      strokeWidth="0.35"
                    />
                  )}

                  {/* Core Organ Hotspot Dot (Steady, high-contrast, fully visible) */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? 1.4 : isHovered ? 1.3 : 1.1}
                    fill={isSelected ? '#38bdf8' : organ.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 0.45 : 0.35}
                    className="cursor-pointer pointer-events-auto transition-transform"
                    onClick={() => onSelectOrgan(organ.id)}
                    onMouseEnter={() => onHoverOrgan(organ.id)}
                    onMouseLeave={() => onHoverOrgan(null)}
                  />

                  {/* Invisible enlarged hit target for easy clicking/touching */}
                  <circle
                    cx={px}
                    cy={py}
                    r="4"
                    fill="transparent"
                    className="cursor-pointer pointer-events-auto"
                    onClick={() => onSelectOrgan(organ.id)}
                    onMouseEnter={() => onHoverOrgan(organ.id)}
                    onMouseLeave={() => onHoverOrgan(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Interactive Label Badges placed on Left & Right Sides */}
          {currentOrgans.map((organ) => {
            const isSelected = selectedOrganId === organ.id;
            const isHovered = hoveredOrganId === organ.id;
            const isLeft = organ.label.side === 'left';
            const displayName = lang === 'en' ? organ.englishName : organ.name;

            return (
              <button
                key={organ.id}
                onClick={() => onSelectOrgan(organ.id)}
                onMouseEnter={() => onHoverOrgan(organ.id)}
                onMouseLeave={() => onHoverOrgan(null)}
                className={`absolute -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xl border cursor-pointer pointer-events-auto whitespace-nowrap z-30 ${
                  isLeft
                    ? '-left-3 -translate-x-full'
                    : '-right-3 translate-x-full'
                } ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-2 border-white ring-4 ring-cyan-400/40 scale-105 font-black shadow-cyan-500/30'
                    : isHovered
                    ? 'bg-slate-900 text-cyan-300 border-cyan-400 scale-102'
                    : 'bg-slate-900/95 text-slate-100 border-slate-700/80 hover:border-slate-500 hover:text-white backdrop-blur-md'
                }`}
                style={{
                  top: `${organ.label.y}%`,
                }}
              >
                <span className="text-sm sm:text-base leading-none">{organ.icon}</span>
                <span>{hideLabelsForTest ? '❓' : displayName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
